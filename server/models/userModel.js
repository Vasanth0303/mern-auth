// server/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Email verification
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtp: {
      type: String,   // we store OTP as STRING
      default: null,
    },
    verifyOtpExpire: {
      type: Date,
      default: null,
    },

    // Reset password
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
