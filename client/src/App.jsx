import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import VerifiedSuccess from "./pages/VerifiedSuccess";
import ProtectedRoute from "./ProtectedRoute";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import NewPassword from "./pages/NewPassword";




import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* Global toast popup container */}
      <ToastContainer position="top-center" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verified-success" element={<VerifiedSuccess />} />
        <Route path="/verify-reset" element={<VerifyResetOtp />} />
        <Route path="/new-password" element={<NewPassword />} />
        

      </Routes>
    </>
  );
}

export default App;
