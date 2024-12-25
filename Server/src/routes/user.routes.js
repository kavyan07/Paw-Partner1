import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    verifyOTP,
    resendOTP,
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser,
    updateUserDetails
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.post("/register", registerUser)
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-user").patch(verifyJWT, updateUserDetails)

export default router