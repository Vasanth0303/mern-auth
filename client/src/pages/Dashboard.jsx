import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import GlassCard from "../GlassCard";
import api from "../api";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Dashboard = () => {
  const { userData, loadingUser, isLoggedin, setIsLoggedin } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loadingUser && !isLoggedin) navigate("/login");
  }, [loadingUser, isLoggedin]);

  if (loadingUser || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Loading user info...
      </div>
    );
  }

  const handleLogout = async () => {
    await api.post("/logout");
    setIsLoggedin(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const sendVerifyOtp = async () => {
    setSending(true);
    try {
      const { data } = await api.post("/send-verify-otp");
      if (data.success) {
        toast.success("Verification OTP sent to your email");
        navigate("/verify");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send OTP");
    }
    setSending(false);
  };

  return (
    <div
      className="
      min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-white via-slate-50 to-white
      dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
      relative overflow-hidden transition
    "
    >
      {/* Background Blobs */}
      <div className="absolute -top-32 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[450px] h-[450px] bg-indigo-500/30 rounded-full blur-[130px]"></div>

      {/* Logo */}
      <img
        src={assets.logo}
        className="absolute top-5 left-5 w-10 h-10 rounded-lg cursor-pointer"
        onClick={() => navigate("/")}
        alt="logo"
      />

      <GlassCard className="w-[95%] max-w-lg p-10 text-center rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {userData.name} 👋
        </h1>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          <strong>Email:</strong> {userData.email}
        </p>

        <p className="mt-1 text-gray-700 dark:text-gray-300">
          <strong>Account Status:</strong>{" "}
          {userData.isAccountVerified ? (
            <span className="text-green-500 font-semibold">Verified ✔</span>
          ) : (
            <span className="text-red-500 font-semibold">Not Verified ❗</span>
          )}
        </p>

        {/* VERIFY BUTTON (SHOW ONLY IF NOT VERIFIED) */}
        {!userData.isAccountVerified && (
          <button
            onClick={sendVerifyOtp}
            disabled={sending}
            className="
              w-full py-3 mt-6 rounded-full 
              bg-gradient-to-r from-indigo-500 to-violet-500 
              text-white font-semibold shadow-lg
              hover:scale-[1.03] transition active:scale-95
            "
          >
            {sending ? "Sending OTP..." : "Verify Email"}
          </button>
        )}

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="
            w-full py-3 mt-4 rounded-full bg-red-500 text-white 
            font-semibold shadow-lg hover:bg-red-600 transition
          "
        >
          Logout
        </button>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
