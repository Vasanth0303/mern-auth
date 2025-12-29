import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const checkAuth = async () => {
    try {
      const authRes = await api.get("/is-auth");

      if (authRes.data.success) {
        setIsLoggedin(true);

        const userRes = await api.get("/data");
        if (userRes.data.success) {
          setUserData(userRes.data.user);
        } else {
          setUserData(null);
        }
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch {
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // 🔴 MOBILE COOKIE FIX
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 500); // ⏳ allow cookie to be ready

    return () => clearTimeout(timer);
  }, []);

  const logout = async () => {
    try {
      await api.get("/logout");
    } catch {}
    setIsLoggedin(false);
    setUserData(null);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedin,
        userData,
        loadingUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};