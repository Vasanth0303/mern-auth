import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import GlassCard from "../GlassCard";

const EmailVerify = () => {
  const navigate = useNavigate();
  const search = new URLSearchParams(useLocation().search);

  const isReset = search.get("reset") === "true";
  const resetEmail = search.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // ========== HANDLE OTP INPUT WITH AUTO MOVE ==========
  const handleOtpKey = (e, index) => {
    const value = e.target.value;

    // BACKSPACE move left
    if (e.key === "Backspace") {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);

      if (index > 0) inputRefs.current[index - 1].focus();
      return;
    }

    // Allow only numbers
    if (!/^[0-9]$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (index < 5) inputRefs.current[index + 1].focus();
  };

  // ========== HANDLE OTP PASTE ==========
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!/^[0-9]{6}$/.test(paste)) return;

    const digits = paste.split("");
    setOtp(digits);

    digits.forEach((d, idx) => {
      inputRefs.current[idx].value = d;
    });

    inputRefs.current[5].focus();
  };

  // ========== VERIFY BUTTON ==========
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) return toast.error("Enter all 6 digits");

    try {
      if (isReset) {
        // RESET PASSWORD OTP VERIFY
        const { data } = await api.post("/verify-reset-otp", {
          email: resetEmail,
          otp: code,
        });

        if (!data.success) return toast.error(data.message);

        toast.success("OTP Verified!");
        navigate(`/new-password?email=${resetEmail}&otp=${code}`, {
          replace: true,
        });
      } else {
        // EMAIL VERIFICATION (AFTER SIGNUP)
        const { data } = await api.post("/verify-account", { otp: code });

        if (!data.success) return toast.error(data.message);

        toast.success("Email Verified!");
        navigate("/verified-success", { replace: true });
      }
    } catch {
      toast.error("Verification failed.");
    }
  };

  // ========== RESEND OTP ==========
  const handleResend = async () => {
    try {
      if (isReset) {
        await api.post("/send-reset-otp", { email: resetEmail });
        toast.success("Reset OTP sent again!");
      } else {
        await api.post("/send-verify-otp");
        toast.success("Verification OTP sent again!");
      }
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="
      min-h-screen flex justify-center items-center 
      bg-gradient-to-br from-white via-slate-50 to-white
      dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
      relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute -top-32 left-10 w-96 h-96 bg-purple-500/30 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-80px] w-[450px] h-[450px] bg-indigo-500/30 blur-[130px] rounded-full" />

      <GlassCard className="w-[90%] max-w-lg p-10 rounded-3xl text-center">

        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          {isReset ? "Reset Password OTP" : "Email Verification"}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              onKeyUp={(e) => handleOtpKey(e, index)}
              onPaste={handlePaste}
              className="
                w-14 h-14 text-center text-2xl font-semibold 
                rounded-xl backdrop-blur-md
                bg-white/40 dark:bg-white/10
                border border-gray-900 dark:border-gray-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500
                text-gray-900 dark:text-white
                outline-none transition
              "
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="
            w-full py-3 rounded-full
            bg-gradient-to-r from-indigo-500 to-violet-500
            text-white font-semibold shadow-lg
            hover:scale-[1.02] active:scale-95 transition
          ">
          Verify OTP
        </button>

        <button
          onClick={handleResend}
          className="mt-5 text-indigo-500 underline hover:text-indigo-400">
          Resend OTP
        </button>

      </GlassCard>
    </div>
  );
};

export default EmailVerify;
