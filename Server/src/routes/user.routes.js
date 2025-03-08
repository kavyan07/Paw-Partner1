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
import passport from 'passport';

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/verify-reset-password-otp").post(verifyResetPasswordOTP)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/verify-otp").post(verifyOTP)
router.route("/resend-otp").post(resendOTP)

//google auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    };
    console.log("Access Token:", req.accessToken);
    console.log("Refresh Token:", req.user.refreshToken);
    res.cookie('accessToken', req.accessToken, options);
    res.cookie('refreshToken', req.user.refreshToken, options);
    res.redirect('http://localhost:5173/additional-info');
});

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-user").patch(verifyJWT, updateUserDetails)

export default router