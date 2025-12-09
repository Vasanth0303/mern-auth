import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import GlassCard from "../GlassCard";
import { assets } from "../assets/assets";

const Home = () => {
  const { isLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div
      className="
      h-screen w-full flex items-center justify-center
      bg-gradient-to-br from-white via-slate-50 to-white
      dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
      relative overflow-hidden transition
    "
    >
      {/* Background Blobs */}
      <div className="absolute -top-20 left-5 w-60 h-60 bg-purple-500/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-40px] right-[-40px] w-72 h-72 bg-indigo-500/30 rounded-full blur-[120px]" />

      {/* Logo */}
      <img
        src={assets.logo}
        className="absolute top-5 left-5 w-10 h-10 rounded-xl shadow-md cursor-pointer"
        onClick={() => navigate("/")}
        alt="logo"
      />

      {/* Main Card */}
      <GlassCard className="w-[92%] max-w-4xl p-6 rounded-3xl text-center">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          Authentication{" "}
          <span className="text-indigo-500">Made Simple</span> &{" "}
          <span className="text-indigo-500">Secure</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm max-w-xl mx-auto">
          A complete authentication system with OTP verification, protected routes, JWT login,
          smooth UI powered by React + Node + Tailwind.
        </p>

        {/* Illustration */}
        <img
          src={assets.header_img}
          className="mt-4 w-28 h-28 mx-auto rounded-xl shadow-md border border-white/10"
        />

        {/* Features (Compact Layout) */}
        <div className="grid grid-cols-2 gap-2 text-sm mt-4 mx-auto max-w-lg">

          <div className="flex items-center gap-2">
            <span className="text-indigo-500 text-lg">✔</span>
            User Registration & Login
          </div>

          <div className="flex items-center gap-2">
            <span className="text-indigo-500 text-lg">✔</span>
            Email Verification (OTP)
          </div>

          <div className="flex items-center gap-2">
            <span className="text-indigo-500 text-lg">✔</span>
            Password Reset via OTP
          </div>

          <div className="flex items-center gap-2">
            <span className="text-indigo-500 text-lg">✔</span>
            JWT Authentication
          </div>

          <div className="flex items-center gap-2">
            <span className="text-indigo-500 text-lg">✔</span>
            Protected Dashboard Route
          </div>

          <div className="flex items-center gap-2">
            <span className="text-indigo-500 text-lg">✔</span>
            Secure Password Hashing
          </div>

        </div>

        {/* Get Started Button */}
        <button
          onClick={() => navigate(isLoggedin ? "/dashboard" : "/login")}
          className="
            mt-5 px-8 py-2 rounded-full text-white font-semibold shadow-md
            bg-gradient-to-r from-indigo-500 to-violet-500
            hover:scale-[1.03] active:scale-95 transition
          "
        >
          {isLoggedin ? "Go to Dashboard" : "Get Started"}
        </button>

      </GlassCard>
    </div>
  );
};

export default Home;
