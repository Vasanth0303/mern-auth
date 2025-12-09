import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlassCard from "../GlassCard";
import { toast } from "react-toastify";
import api from "../api";

const NewPassword = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);

  const email = params.get("email");
  const otp = params.get("otp");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    if (!password) return toast.error("Enter new password");

    setLoading(true);

    try {
      const { data } = await api.post("/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      if (!data.success) return toast.error(data.message);

      toast.success("Password updated!");
      navigate("/login");
    } catch {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div
      className="
      min-h-screen flex items-center justify-center
      bg-gradient-to-br from-white via-slate-50 to-white
      dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
      relative overflow-hidden transition"
    >

      {/* Background Blobs */}
      <div className="absolute -top-32 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[450px] h-[450px] bg-indigo-500/30 rounded-full blur-[130px]"></div>

      <GlassCard className="w-[95%] max-w-md p-10 rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Set New Password
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
          Create a secure new password for <b>{email}</b>
        </p>

        {/* Password Input - Same floating label style as Login.jsx */}
        <div className="relative mb-8">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-4 py-3 peer
              bg-white/40 dark:bg-white/10
              border border-white/30 dark:border-white/10
              rounded-xl backdrop-blur-md
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-indigo-400
            "
          />
          <label
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              text-gray-500 dark:text-gray-300
              peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-500
              peer-valid:-top-3 peer-valid:text-xs
              transition-all duration-200
            "
          >
            New Password
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={resetPassword}
          className="
            w-full py-3 rounded-full
            bg-gradient-to-r from-indigo-500 to-violet-500
            text-white font-semibold shadow-lg
            hover:scale-[1.02] active:scale-95 transition
          "
        >
          {loading ? "Saving..." : "Save Password"}
        </button>

        {/* Back to Login */}
        <p className="text-center mt-6 text-sm text-gray-700 dark:text-gray-300">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-500 underline cursor-pointer hover:text-indigo-400"
          >
            Login here
          </span>
        </p>
      </GlassCard>
    </div>
  );
};

export default NewPassword;
