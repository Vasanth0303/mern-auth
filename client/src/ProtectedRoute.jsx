import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedin, loadingUser } = useContext(AppContext);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
