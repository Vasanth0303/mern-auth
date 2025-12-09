import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: false, // VERY IMPORTANT for Brevo 587
  tls: {
    rejectUnauthorized: false, // Fix "self-signed certificate" errors
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log("❌ Email connection error:", err);
  } else {
    console.log("📨 Email server ready");
  }
});

export default transporter;
