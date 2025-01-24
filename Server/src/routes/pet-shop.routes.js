import { Router } from "express";
import {
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
} from "../controllers/pet-shop.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerShop);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-password-otp").post(verifyResetPasswordOTP);
router.route("/login").post(loginShop);
router.route("/logout").post(verifyJWT, logoutShop);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getShopProfile);
router.route("/update-details").patch(verifyJWT, updateShopDetails);

export default router;