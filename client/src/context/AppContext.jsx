import React, { createContext, useEffect, useState } from "react";
import api from "../api.js";

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
    } catch (err) {
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
    } catch (err) {
        // ❌ REMOVE TOAST HERE
        console.log("User data fetch failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setIsLoggedin(false);
      setUserData(null);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};