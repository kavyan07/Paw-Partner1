import { Router } from "express";
import {
    registerAdoptionCenter,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetPasswordOTP,
    loginAdoptionCenter,
    logoutAdoptionCenter,
    refreshAccessToken,
    getAdoptionCenter,
    updateAdoptionCenter
} from "../controllers/adoption-center.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdoptionCenter);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-password-otp").post(verifyResetPasswordOTP);
router.route("/login").post(loginAdoptionCenter);
router.route("/logout").post(verifyJWT, logoutAdoptionCenter);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getAdoptionCenter);
router.route("/update-details").patch(verifyJWT, updateAdoptionCenter);

export default router;