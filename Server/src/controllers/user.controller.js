import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import sgMail from '@sendgrid/mail'
import { TempUser} from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, contact, address, role } = req.body

    if ([email, username, password, contact, address, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    await TempUser.findOneAndDelete({ email });
    const otp = String(Math.floor(100000 + Math.random() * 900000)) // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    const tempUser = await TempUser.create({
        email,
        username,
        password,
        contact,
        address,
        role,
        otp,
        otpExpiry
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
        await TempUser.findByIdAndDelete(tempUser._id)
        throw new ApiError(500, "Error sending OTP email")
    }
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp} = req.body
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required")
    }

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser || tempUser.otpExpiry < new Date()) {
        throw new ApiError(400, "OTP expired or invalid email")
    }
    if (tempUser.otp.toString() !== otp.toString()) {
        tempUser.findByIdAndDelete(tempUser._id)
        throw new ApiError(400, "Invalid OTP");
    }

    // Create actual user
    const user = await User.create({
        email: tempUser.email,
        username: tempUser.username,
        password: tempUser.password,
        contact: tempUser.contact,
        address: tempUser.address,
        role: tempUser.role
    })

    // Delete temporary user
    await TempUser.findByIdAndDelete(tempUser._id)

    // Generate tokens
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    // Update user with refresh token
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    // Get user without sensitive info
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User registered successfully"
            )
        )
})

// Add resend OTP functionality
const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const tempUser = await TempUser.findOne({ email })

    if (!tempUser) {
        throw new ApiError(404, "No pending registration found for this email")
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    // Update temporary user with new OTP
    tempUser.otp = otp
    tempUser.otpExpiry = otpExpiry
    await tempUser.save()

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

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    // Create temporary OTP storage
const tempOTPData = await TempUser.create({
    email: user.email,
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

    const tempOTPData = await TempUser.findOne({ email })

    if (!tempOTPData || tempOTPData.otpExpiry < new Date()) {
        throw new ApiError(400, "Invalid or expired OTP")
    }

    if (tempOTPData.otp.toString() !== otp.toString()) {
        throw new ApiError(400, "Invalid OTP")
    }

    const user = await User.findOne({ email })
    user.password = newPassword
    user.save({ validateBeforeSave: false })
    TempUser.findByIdAndDelete(tempOTPData._id)
    
    return res.status(200).json(
        new ApiResponse(
            200,
            { email },
            "password chaged successfully"
        )
    )
})

const loginUser = asyncHandler(async (req, res) =>{
    const {email, username, password} = req.body
    //console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, 
                role: loggedInUser.role
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
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
    .json(new ApiResponse(200, {}, "User logged Out"))
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
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
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

const getCurrentUser = asyncHandler(async(req, res) => {
    const user = req.user || req.cookies.user
    user.password = undefined
    user.refreshToken = undefined
    if (!user) {
        throw new ApiError(401, "unauthorized request")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "User fetched successfully"
    ))
})

const updateUserDetails = asyncHandler(async(req, res) => {
    const {username, email, address, contact} = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    // Check if username or email already exists for other users
    const existingUser = await User.findOne({
        $and: [
            { _id: { $ne: req.user?._id } }, // Exclude current user
            { $or: [
                { email: email }
            ]}
        ]
    });

    if (existingUser) {
        throw new ApiError(409, "Username or email already taken by another user")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username.toLowerCase(),
                email: email,
                address: address,
                contact: contact
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

export {
    registerUser,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetPasswordOTP,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUserDetails,
    generateAccessAndRefereshTokens
}