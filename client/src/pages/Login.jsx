import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import api from "../api";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import GlassCard from "../GlassCard";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedin, getUserData } = useContext(AppContext);

  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/register" : "/login";
      const { data } = await api.post(endpoint, form);

      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      // ⭐ SIGNUP MODE (Account Create ONLY)
      if (mode === "signup") {
        toast.success("Account created! Please login.");
        setLoading(false);
        return; // ❗ Do not redirect to verify page
      }

      // ⭐ LOGIN MODE
      toast.success("Login successful!");
      setIsLoggedin(true);
      await getUserData();
      navigate("/dashboard");

    } catch (error) {
      toast.error("Request failed");
    }

    setLoading(false);
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

      <GlassCard className="w-[95%] max-w-md p-10 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-2 mb-8 text-sm">
          {mode === "signup"
            ? "Start your journey with a secure authentication system."
            : "Login to access your dashboard."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {mode === "signup" && (
            <div className="relative">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="
                  w-full px-4 py-3 peer
                  bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/10
                  rounded-xl backdrop-blur-md
                  text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              />
              <label
                className="
                  absolute left-4 top-1/2 -translate-y-1/2 
                  peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-500
                  peer-valid:-top-3 peer-valid:text-xs
                  text-gray-500 dark:text-gray-300
                  transition-all duration-200
                "
              >
                Full Name
              </label>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="
                w-full px-4 py-3 peer
                bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/10
                rounded-xl backdrop-blur-md
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-400
              "
            />
            <label
              className="
                absolute left-4 top-1/2 -translate-y-1/2
                peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-500
                peer-valid:-top-3 peer-valid:text-xs
                text-gray-500 dark:text-gray-300
                transition-all duration-200
              "
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="
                w-full px-4 py-3 peer
                bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/10
                rounded-xl backdrop-blur-md
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-400
              "
            />
            <label
              className="
                absolute left-4 top-1/2 -translate-y-1/2
                peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-500
                peer-valid:-top-3 peer-valid:text-xs
                text-gray-500 dark:text-gray-300
                transition-all duration-200
              "
            >
              Password
            </label>
          </div>

          <button
            disabled={loading}
            className="
              w-full py-3 rounded-full 
              bg-gradient-to-r from-indigo-500 to-violet-500 
              text-white font-semibold shadow-lg
              hover:scale-[1.02] active:scale-95 transition
            "
          >
            {loading ? <Spinner /> : mode === "signup" ? "Create Account" : "Login"}
          </button>
        </form>

        {mode === "login" && (
          <p
            className="text-sm text-indigo-500 text-center mt-4 cursor-pointer hover:text-indigo-400"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </p>
        )}

        <p className="text-center mt-6 text-sm text-gray-700 dark:text-gray-300">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <span
            className="text-indigo-500 cursor-pointer hover:text-indigo-400 underline"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Login Instead" : "Create Account"}
          </span>
        </p>
      </GlassCard>
    </div>
  );
};

export default Login;
