import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetPasswordOTP,
    refreshAccessToken,
    getCurrentUser,
    updateUserDetails
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/verify-reset-password-otp").post(verifyResetPasswordOTP)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/verify-otp").post(verifyOTP)
router.route("/resend-otp").post(resendOTP)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-user").patch(verifyJWT, updateUserDetails)

export default router