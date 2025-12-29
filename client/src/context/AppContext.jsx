import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔐 CHECK AUTH
  const checkAuth = async () => {
    try {
      const res = await api.get("/is-auth");

      if (res.data.success) {
        setIsLoggedin(true);

        // fetch user ONLY if auth is valid
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
    } catch (err) {
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      // 🔴 CRITICAL FIX
      setLoadingUser(false);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await api.get("/logout"); // GET matches backend
    } catch (err) {
      console.log("Logout error");
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