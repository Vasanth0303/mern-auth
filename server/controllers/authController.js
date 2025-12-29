// server/controllers/authController.js

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/email.js";

// ===========================
// CREATE JWT TOKEN
// ===========================
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ===========================
// REGISTER USER
// ===========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      isAccountVerified: false,
    });

    return res.json({
      success: true,
      message: "Account created! Verify your email.",
    });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
};

// ===========================
// LOGIN USER
// ===========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Incorrect password" });

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
};

// ===========================
// LOGOUT
// ===========================
export const logoutUser = async (req, res) => {
  res.clearCookie("token",{
    httpOnly: true,
    secure: true,
    sameSite: "none",

  });
  return res.json({ success: true, message: "Logged out" });
};

// ===========================
// CHECK AUTH
// ===========================
export const isAuth = async (req, res) => {
  return res.json({ success: true });
};

// ===========================
// GET USER DATA
// ===========================
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
};

// ===========================
// SEND EMAIL VERIFY OTP
// ===========================
export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.isAccountVerified)
      return res.json({
        success: false,
        message: "Account already verified",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOtp = otp;
    user.verifyOtpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your Email",
      html: `<h2>Your Email Verification OTP is: <b>${otp}</b></h2>`,
    });

    return res.json({
      success: true,
      message: "Verification OTP sent!",
    });
  } catch (err) {
    return res.json({ success: false, message: "Email send failed" });
  }
};

// ===========================
// VERIFY ACCOUNT OTP
// ===========================
export const verifyAccount = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.userId);
    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.verifyOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.verifyOtpExpire < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpire = null;
    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
};

// ===========================
// SEND RESET OTP
// ===========================
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      html: `<h2>Your Reset OTP is: <b>${otp}</b></h2>`,
    });

    return res.json({
      success: true,
      message: "Reset OTP sent!",
    });
  } catch (err) {
    return res.json({ success: false, message: "Email failed" });
  }
};

// ===========================
// VERIFY RESET OTP
// ===========================
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp)
      return res.json({ success: false, message: "Wrong OTP" });

    if (user.resetOtpExpire < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    return res.json({ success: true, message: "OTP Verified" });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
};

// ===========================
// RESET PASSWORD
// ===========================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    user.resetOtp = null;
    user.resetOtpExpire = null;

    await user.save();

    return res.json({ success: true, message: "Password updated" });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
};
