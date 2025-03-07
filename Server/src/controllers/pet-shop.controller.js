import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Shop } from "../models/pet-shop.model.js"
import sgMail from '@sendgrid/mail'
import { TempShop } from "../models/pet-shop.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async(shopId) =>{
    try {
        const shop = await Shop.findById(shopId)
        const accessToken = shop.generateAccessToken()
        const refreshToken = shop.generateRefreshToken()

        shop.refreshToken = refreshToken
        await shop.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const registerShop = asyncHandler(async (req, res) => {
    // Add username to the destructuring
    const { email, password, contact, address, shopName, role, username } = req.body

    // Make sure username is included in the validation check
    if ([email, username, password, contact, shopName, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedShop = await Shop.findOne({
        $or: [{ shopName }, { email }]
    })

    if (existedShop) {
        throw new ApiError(409, "Shop with email or shopName already exists")
    }
    await TempShop.findOneAndDelete({ email });
    const otp = String(Math.floor(100000 + Math.random() * 900000)) // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    const tempShop = await TempShop.create({
        email,
        password,
        contact,
        shopName,
        address,
        role,
        username, // Include username in the tempShop creation
        otp,
        otpExpiry
    })

    const msg = {
        to: email,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: "Pet Shop - Email Verification OTP",
        text: `Welcome Pet Shop! Your OTP for registration is: ${otp}. Valid for 10 minutes.`,
        html: `
            <h1>Pet Shop - Email Verification</h1>
            <p>Welcome Pet Shop!</p>
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
        await TempShop.findByIdAndDelete(tempShop._id)
        throw new ApiError(500, "Error sending OTP email")
    }
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp, username } = req.body // Add username here too
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required")
    }

    const tempShop = await TempShop.findOne({ email });

    if (!tempShop || tempShop.otpExpiry < new Date()) {
        throw new ApiError(400, "OTP expired or invalid email")
    }
    if (tempShop.otp.toString() !== otp.toString()) {
        throw new ApiError(400, "Invalid OTP");
    }

    // Create actual shop
    const shop = await Shop.create({
        email: tempShop.email,
        shopName: tempShop.shopName,
        password: tempShop.password,
        contact: tempShop.contact,
        address: tempShop.address,
        role: tempShop.role,
        username: tempShop.username || username // Use the username from tempShop or from request
    })

    // Delete temporary shop
    await TempShop.findByIdAndDelete(tempShop._id)

    // Generate tokens
    const accessToken = shop.generateAccessToken()
    const refreshToken = shop.generateRefreshToken()

    // Update shop with refresh token
    shop.refreshToken = refreshToken
    await shop.save({validateBeforeSave: false})

    // Get shop without sensitive info
    const loggedInShop = await Shop.findById(shop._id).select("-password -refreshToken")

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
                    shop: loggedInShop,
                    accessToken,
                    refreshToken
                },
                "Pet shop registered successfully"
            )
        )
})

// Add resend OTP functionality
const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const tempShop = await TempShop.findOne({ email })

    if (!tempShop) {
        throw new ApiError(404, "No pending registration found for this email")
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    // Update temporary shop with new OTP
    tempShop.otp = otp
    tempShop.otpExpiry = otpExpiry
    await tempShop.save()

    const msg = {
        to: email,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: "Pet Shop - New Email Verification OTP",
        text: `Your new OTP for Pet Shop registration is: ${otp}. Valid for 10 minutes.`,
        html: `
            <h1>Pet Shop - New Email Verification OTP</h1>
            <p>Your new OTP for Pet Shop registration is: <strong>${otp}</strong></p>
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

    const shop = await Shop.findOne({ email })

    if (!shop) {
        throw new ApiError(404, "Pet shop not found")
    }

    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    // Create temporary OTP storage
    const tempOTPData = await TempShop.create({
        email: shop.email,
        otp,
        otpExpiry
    })

    const msg = {
        to: email,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: "Pet Shop - Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. Valid for 10 minutes.`,
        html: `
            <h1>Pet Shop - Password Reset OTP</h1>
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

    const tempOTPData = await TempShop.findOne({ email })

    if (!tempOTPData || tempOTPData.otpExpiry < new Date()) {
        throw new ApiError(400, "Invalid or expired OTP")
    }

    if (tempOTPData.otp.toString() !== otp.toString()) {
        throw new ApiError(400, "Invalid OTP")
    }

    const shop = await Shop.findOne({ email })
    shop.password = newPassword
    shop.save({ validateBeforeSave: false })
    TempShop.findByIdAndDelete(tempOTPData._id)
    
    return res.status(200).json(
        new ApiResponse(
            200,
            { email },
            "Password changed successfully"
        )
    )
})

const loginShop = asyncHandler(async (req, res) =>{
    const {email, shopName, password, username} = req.body // Add username here

    if (!shopName && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const shop = await Shop.findOne({
        $or: [{shopName}, {email}, {username}] // Add username to the query
    })

    if (!shop) {
        throw new ApiError(404, "Pet shop does not exist")
    }

   const isPasswordValid = await shop.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(shop._id)

    const loggedInShop = await Shop.findById(shop._id).select("-password -refreshToken")

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
                shop: loggedInShop,
                accessToken,
                refreshToken
            },
            "Pet shop logged in successfully"
        )
    )
})

const logoutShop = asyncHandler(async (req, res) => {
    await Shop.findByIdAndUpdate(
        req.shop._id,
        {
            $unset: {
                refreshToken: 1
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
    .json(new ApiResponse(200, {}, "Pet shop logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        throw new ApiError(401, "Access denied, token missing")
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const shop = await Shop.findById(decoded._id)

        if (!shop) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(shop._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getShopProfile = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.shop, "Pet shop profile fetched successfully"))
})

const updateShopDetails = asyncHandler(async (req, res) => {
    const { shopName, email, contact, address, username } = req.body // Add username here
    if (!shopName || !email || !contact || !address) {
        throw new ApiError(400, "All fields are required")
    }
    const petShop = await Shop.findById(req.shop._id)
    const existingShop = await Shop.findOne({
        $and: [
            { _id: { $ne: req.shop?._id } }, // Exclude current shop
            { $or: [
                { shopName: shopName.toLowerCase() },
                { email: email },
                { username: username } // Add username check
            ]}
        ]
    })

    if (existingShop) {
        throw new ApiError(409, "Shop with email, username or shopName already exists")
    }

    let imageUrl = petShop.imageUrl 
    if(req.file) {
        const uploadOnCloudinary = (path) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(path)
                }, 500)
            })
        }
        imageUrl = await uploadOnCloudinary(req.file.path);
        if(imageUrl == petShop.imageUrl) {
            throw new ApiError(500, "Error uploading image to cloudinary")
        }
    }

    const shop = await Shop.findByIdAndUpdate(
        req.shop?._id,
        {
            $set: {
                shopName,
                email,
                contact,
                address,
                username, // Add username to the update
                imageUrl
            }
        },
        { new: true }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, shop, "Pet shop details updated successfully"))
})

export {
    registerShop,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetPasswordOTP,
    loginShop,
    logoutShop,
    refreshAccessToken,
    getShopProfile,
    updateShopDetails
}
