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
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    if (!loadingUser && !isLoggedin) navigate("/login");
  }, [loadingUser, isLoggedin]);

  if (loadingUser || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">

      {/* Background blobs */}
      <div className="absolute -top-32 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[450px] h-[450px] bg-indigo-500/30 rounded-full blur-[130px]"></div>

      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className="absolute top-5 left-5 w-10 h-10 rounded-lg cursor-pointer z-10"
        onClick={() => navigate("/")}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <GlassCard className="w-full max-w-3xl p-10 rounded-3xl shadow-2xl">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {userData.name} 👋
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your account, security & session
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <StatCard title="Account Status">
              {userData.isAccountVerified ? (
                <span className="text-green-500 font-semibold">Verified</span>
              ) : (
                <span className="text-red-500 font-semibold">Not Verified</span>
              )}
            </StatCard>

            <StatCard title="Login Method">Email & Password</StatCard>
            <StatCard title="Session">Active</StatCard>
          </div>

          {/* PROFILE */}
          <Section title="Profile Information">
            <p className="text-gray-700 dark:text-gray-300">
              <b>Name:</b> {userData.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <b>Email:</b>{" "}
              <a
                href={`mailto:${userData.email}`}
                className="text-indigo-600 hover:underline"
              >
                {userData.email}
              </a>
            </p>

            {!userData.isAccountVerified && (
              <button
                onClick={sendVerifyOtp}
                disabled={sending}
                className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:scale-[1.03] active:scale-95 transition"
              >
                {sending ? "Sending OTP..." : "Verify Email"}
              </button>
            )}
          </Section>

          {/* ACCOUNT OVERVIEW */}
          <Section title="Account Overview">
            <GridText
              items={[
                "Account Created: Recently",
                "Region: India",
                "Auth Type: JWT + Cookies",
                "Security Level: High",
              ]}
            />
          </Section>

          {/* SECURITY CHECKLIST */}
          <Section title="Security Checklist">
            <List
              items={[
                "Password encrypted",
                "Email verification enabled",
                "JWT protected routes",
                "Secure logout handling",
                "HttpOnly cookies used",
              ]}
            />
          </Section>

          {/* SESSION INFO */}
          <Section title="Session Information">
            <List
              items={[
                "Current session: Active",
                "Device: Web Browser",
                "Session security: Protected",
              ]}
            />
          </Section>

          {/* FEATURES */}
          <Section title="Enabled Features">
            <GridText
              items={[
                "Protected Routes",
                "OTP Email Verification",
                "Secure Logout",
                "Context API State",
                "Tailwind CSS UI",
                "Glassmorphism Design",
              ]}
            />
          </Section>

          {/* HELP & SUPPORT */}
          <Section title="Help & Support">
            <p className="text-gray-700 dark:text-gray-300">
              Need help with login or verification? Contact support below.
            </p>

            <button
              onClick={() => setShowSupport(true)}
              className="mt-4 px-6 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
            >
              Contact Support
            </button>
          </Section>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full py-3 mt-10 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>

          {/* FOOTER */}
          <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 MERN Authentication System <br />
            Built with React, Node.js, Express & MongoDB
          </div>

        </GlassCard>
      </div>

      {/* SUPPORT MODAL */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For any issues, please email:
              <br />
              <a
                href="mailto:vasanthmrsir@gmail.com?subject=Support%20Request"
                className="text-indigo-600 font-semibold hover:underline"
              >
                vasanthmrsir@gmail.com
              </a>
            </p>
            <button
              onClick={() => setShowSupport(false)}
              className="w-full py-2 bg-indigo-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== SMALL COMPONENTS ===== */

const StatCard = ({ title, children }) => (
  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg p-5 rounded-2xl text-center shadow-md">
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
      {children}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-10 border-t border-white/20 pt-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      {title}
    </h2>
    {children}
  </div>
);

const GridText = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
    {items.map((item, i) => (
      <span key={i}>✔ {item}</span>
    ))}
  </div>
);

const List = ({ items }) => (
  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
    {items.map((item, i) => (
      <li key={i}>✅ {item}</li>
    ))}
  </ul>
);

export default Dashboard;
