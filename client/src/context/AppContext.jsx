import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/is-auth");

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch {
      setIsLoggedin(false);
    } finally {
      setLoadingUser(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await api.get("/data");
      if (data.success) {
        setUserData(data.user);
      }
    } catch {
      console.log("User data load failed");
    }
  };

  // ✔ FINAL LOGOUT FUNCTION
  const logout = async () => {
    try {
      await api.post("/logout");

      setIsLoggedin(false);
      setUserData(null);  // clear all user info
    } catch {
      console.log("Logout failed");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedin,
        userData,
        loadingUser,
        logout,
        setIsLoggedin,
        getUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
