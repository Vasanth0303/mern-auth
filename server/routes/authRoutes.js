// server/routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  isAuth,
  getUserData,
  sendVerifyOtp,
  verifyAccount,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// USER
router.get("/is-auth", userAuth, isAuth);
router.get("/me", userAuth, getUserData);

// EMAIL VERIFY (NEEDS LOGIN)
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-account", userAuth, verifyAccount);

// PASSWORD RESET (NO LOGIN REQUIRED)
router.post("/send-reset-otp", sendResetOtp);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;
