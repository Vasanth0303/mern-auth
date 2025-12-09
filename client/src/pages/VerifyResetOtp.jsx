import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "../GlassCard";
import { toast } from "react-toastify";
import api from "../api";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const email = new URLSearchParams(useLocation().search).get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Handle typing and backspace logic
  const handleOtp = (value, index, e) => {
    // Move backward on Backspace
    if (e.key === "Backspace") {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);

      if (index > 0) inputRefs.current[index - 1].focus();
      return;
    }

    // Only digits allowed
    if (!/^[0-9]$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Move forward
    if (index < 5) inputRefs.current[index + 1].focus();
  };

  // Paste full OTP
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^[0-9]{6}$/.test(pasted)) return;

    const digits = pasted.split("");
    setOtp(digits);

    digits.forEach((d, i) => {
      inputRefs.current[i].value = d;
    });

    inputRefs.current[5].focus();
  };

  const submitOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) return toast.error("Enter all 6 digits");

    try {
      const { data } = await api.post("/verify-reset-otp", { email, otp: code });

      if (!data.success) return toast.error(data.message);

      toast.success("OTP Verified!");
      navigate(`/new-password?email=${email}&otp=${code}`);
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div
      className="
      min-h-screen flex items-center justify-center
      bg-gradient-to-br from-white via-slate-50 to-white
      dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
      relative overflow-hidden"
    >

      {/* Background Blobs */}
      <div className="absolute -top-32 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[450px] h-[450px] bg-indigo-500/30 rounded-full blur-[130px]"></div>

      <GlassCard className="w-[95%] max-w-md p-10 rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Verify OTP
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-2 mb-8 text-sm">
          Enter the 6-digit OTP sent to <b>{email}</b>
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 mb-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              defaultValue={digit}
              onKeyDown={(e) => handleOtp(e.target.value, index, e)}
              onChange={(e) => handleOtp(e.target.value, index, e)}
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
          onClick={submitOtp}
          className="
            w-full py-3 rounded-full 
            bg-gradient-to-r from-indigo-500 to-violet-500 
            text-white font-semibold shadow-lg
            hover:scale-[1.02] active:scale-95 transition"
        >
          Verify OTP
        </button>

        <p className="text-center mt-6 text-sm text-gray-700 dark:text-gray-300">
          Wrong email?{" "}
          <span
            className="text-indigo-500 underline cursor-pointer hover:text-indigo-400"
            onClick={() => navigate("/reset-password")}
          >
            Try again
          </span>
        </p>
      </GlassCard>
    </div>
  );
};

export default VerifyResetOtp;
