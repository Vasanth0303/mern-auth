import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";

const app = express();

// DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// ✅ IMPORTANT FIX
app.use(
  cors({
    origin: process.env.CLIENT_URL, // EXACT frontend URL
    credentials: true,
  })
);

// ROUTES
app.use("/api/auth", authRoutes);

// START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});