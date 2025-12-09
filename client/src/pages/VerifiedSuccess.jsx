import React from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../GlassCard";
import { assets } from "../assets/assets";

const VerifiedSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center relative overflow-hidden px-4">

      {/* Background Blobs */}
      <div className="absolute -top-24 -left-10 w-72 h-72 bg-purple-500/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-90px] w-96 h-96 bg-indigo-500/40 rounded-full blur-3xl"></div>

      {/* Logo */}
      <img
        src={assets.logo}
        className="absolute top-5 left-5 w-10 h-10 rounded-lg cursor-pointer"
        alt=""
        onClick={() => navigate("/")}
      />

      {/* Success Card */}
      <GlassCard className="w-[95%] max-w-md p-10 text-center animate-card">

        <h2 className="text-3xl font-semibold text-green-400 mb-3">
          🎉 Email Verified!
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your account has been successfully verified.  
          You can now access all features securely.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold shadow-lg transition-transform active:scale-95"
        >
          Go to Dashboard
        </button>
      </GlassCard>
    </div>
  );
};

export default VerifiedSuccess;
