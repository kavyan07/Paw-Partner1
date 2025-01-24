 import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { AdoptionCenter } from "../models/adoption-center.model.js" 
import sgMail from '@sendgrid/mail'
import { TempAdoptionCenter } from "../models/adoption-center.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(centerId) =>{
    try {
        const center = await AdoptionCenter.findById(centerId)
        const accessToken = center.generateAccessToken()
        const refreshToken = center.generateRefreshToken()

        center.refreshToken = refreshToken
        await center.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const registerAdoptionCenter = asyncHandler(async (req, res) => {
    const { email, password, adoptionCenterName, address, contact, role, adoptionCenterDescription } = req.body

    if ([email, password, adoptionCenterName, address, contact, role, adoptionCenterDescription].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedCenter = await AdoptionCenter.findOne({
        $or: [{ adoptionCenterName }, { email }]
    })

    if (existedCenter) {
        throw new ApiError(409, "Adoption center with email or name already exists")
    }
    await TempAdoptionCenter.findOneAndDelete({ email });
    const otp = String(Math.floor(100000 + Math.random() * 900000)) // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    const tempCenter = await TempAdoptionCenter.create({
        email,
        adoptionCenterName,
        password,
        contact,
        address,
        role,
        otp,
        otpExpiry,
        adoptionCenterDescription
    })

    const msg = {
        to: email,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: "Email Verification OTP",
        text: `Your OTP for registration is: ${otp}. Valid for 10 minutes.`,
        html: `
            <h1>Email Verification</h1>
            <p>Your OTP for registration is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes.</p>
        `
    }

    try {
        await sgMail.send(msg)
        return res.status(200).json(
            new ApiResponse(
                200,
                { email },
                "OTP sent successfully. Please verify your email."
            )
        )
    } catch (error) {
        await TempAdoptionCenter.findByIdAndDelete(tempCenter._id)
        throw new ApiError(500, "Error sending OTP email")
    }
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp} = req.body
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required")
    }

    const tempCenter = await TempAdoptionCenter.findOne({ email });

    if (!tempCenter || tempCenter.otpExpiry < new Date()) {
        throw new ApiError(400, "OTP expired or invalid email")
    }
    if (tempCenter.otp.toString() !== otp.toString()) {
        tempCenter.findByIdAndDelete(tempCenter._id)
        throw new ApiError(400, "Invalid OTP");
    }

    // Create actual adoption center
    const center = await AdoptionCenter.create({
        email: tempCenter.email,
        adoptionCenterName: tempCenter.adoptionCenterName,
        password: tempCenter.password,
        contact: tempCenter.contact,
        address: tempCenter.address,
        role: tempCenter.role,
        adoptionCenterDescription: tempCenter.adoptionCenterDescription
    })

    // Delete temporary center
    await TempAdoptionCenter.findByIdAndDelete(tempCenter._id)

    // Generate tokens
    const accessToken = center.generateAccessToken()
    const refreshToken = center.generateRefreshToken()

    // Update center with refresh token
    center.refreshToken = refreshToken
    await center.save({validateBeforeSave: false})

    // Get center without sensitive info
    const loggedInCenter = await AdoptionCenter.findById(center._id).select("-password -refreshToken")

    // Set cookies
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    center: loggedInCenter,
                    accessToken,
                    refreshToken
                },
                "Adoption center registered successfully"
            )
        )
})

// Add resend OTP functionality
const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const tempCenter = await TempAdoptionCenter.findOne({ email })

    if (!tempCenter) {
        throw new ApiError(404, "No pending registration found for this email")
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    // Update temporary center with new OTP
    tempCenter.otp = otp
    tempCenter.otpExpiry = otpExpiry
    await tempCenter.save()

    const msg = {
        to: email,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: "New Email Verification OTP",
        text: `Your new OTP for registration is: ${otp}. Valid for 10 minutes.`,
        html: `
            <h1>New Email Verification OTP</h1>
            <p>Your new OTP for registration is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes.</p>
        `
    }

    try {
        await sgMail.send(msg)
        return res.status(200).json(
            new ApiResponse(
                200,
                { email },
                "New OTP sent successfully"
            )
        )
    } catch (error) {
        throw new ApiError(500, "Error sending OTP email")
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const center = await AdoptionCenter.findOne({ email })

    if (!center) {
        throw new ApiError(404, "Adoption center not found")
    }

    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    // Create temporary OTP storage
    const tempOTPData = await TempAdoptionCenter.create({
        email: center.email,
        otp,
        otpExpiry
    })

    const msg = {
        to: email,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. Valid for 10 minutes.`,
        html: `
            <h1>Password Reset OTP</h1>
            <p>Your OTP for password reset is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes.</p>
        `
    }

    try {
        await sgMail.send(msg)
        return res.status(200).json(
            new ApiResponse(
                200,
                { email },
                "OTP sent successfully for password reset"
            )
        )
    } catch (error) {
        throw new ApiError(500, "Error sending OTP email")
    }
})

const verifyResetPasswordOTP = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required")
    }

    const tempOTPData = await TempAdoptionCenter.findOne({ email })

    if (!tempOTPData || tempOTPData.otpExpiry < new Date()) {
        throw new ApiError(400, "Invalid or expired OTP")
    }

    if (tempOTPData.otp.toString() !== otp.toString()) {
        throw new ApiError(400, "Invalid OTP")
    }

    const center = await AdoptionCenter.findOne({ email })
    center.password = newPassword
    center.save({ validateBeforeSave: false })
    TempAdoptionCenter.findByIdAndDelete(tempOTPData._id)
    
    return res.status(200).json(
        new ApiResponse(
            200,
            { email },
            "password changed successfully"
        )
    )
})

const loginAdoptionCenter = asyncHandler(async (req, res) =>{
    const {email, adoptionCenterName, password} = req.body

    if (!adoptionCenterName && !email) {
        throw new ApiError(400, "name or email is required")
    }

    const center = await AdoptionCenter.findOne({
        $or: [{adoptionCenterName}, {email}]
    })

    if (!center) {
        throw new ApiError(404, "Adoption center does not exist")
    }

   const isPasswordValid = await center.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(center._id)

   const loggedInCenter = await AdoptionCenter.findById(center._id).select("-password -refreshToken")
   const options = {
    httpOnly: true,
    secure: true
   }

   return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                center: loggedInCenter,
                accessToken,
                refreshToken
            },
            "Adoption center logged in successfully"
        )
    )
})
const logoutAdoptionCenter = asyncHandler(async(req, res) => {
    await AdoptionCenter.findByIdAndUpdate(
        req.center._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Adoption center logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const center = await AdoptionCenter.findById(decodedToken?._id)
    
        if (!center) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== center?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(center._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const getAdoptionCenter = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.center,
        "Adoption center fetched successfully"
    ))
})

const updateAdoptionCenter = asyncHandler(async (req, res) => {
    const {adoptionCenterName, contact, address, email} = req.body

    if (!adoptionCenterName || !contact || !address || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const AdoptionCenter = await AdoptionCenter.findById(req.center._id)

    const existingCenter = await AdoptionCenter.findOne({
        $and: [
            { _id: { $ne: req.center?._id } }, // Exclude current user
            { $or: [
                { adoptionCenterName: adoptionCenterName.toLowerCase() },
                { email: email }
            ]}
        ]
    });

    if (existingCenter) {
        throw new ApiError(409, "Adoption center with name or email already exists")
    }

    let imageUrl = AdoptionCenter.imageUrl 
    if(req.file) {
        imageUrl = await uploadOnCloudinary(req.file.path);
        if(imageUrl == AdoptionCenter.imageUrl) {
            throw new ApiError(500, "Error uploading image to cloudinary")
        }
    }

    const center = await AdoptionCenter.findByIdAndUpdate(
        req.center?._id,
        {
            $set: {
                adoptionCenterName,
                email,
                contact,
                address,
                imageUrl
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        center,
        "Adoption center updated successfully"
    ))
})

const allAdoptionCenters = asyncHandler(async (req, res) => {
    const centers = await AdoptionCenter.find();
    return res.status(200).json(
        new ApiResponse(200, centers, "All adoption centers fetched successfully")
    );
});

export {
    registerAdoptionCenter,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetPasswordOTP,
    loginAdoptionCenter,
    logoutAdoptionCenter,
    refreshAccessToken,
    getAdoptionCenter,
    updateAdoptionCenter,
    allAdoptionCenters
}