import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // =========================
  // CHECK AUTH STATUS
  // =========================
  const checkAuth = async () => {
    try {
      const { data } = await api.get("/is-auth");

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false); // 🔥 ALWAYS stop loading
    }
  };

  // =========================
  // GET USER DATA
  // =========================
  const getUserData = async () => {
    try {
      const { data } = await api.get("/data");

      if (data.success) {
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      setUserData(null);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log("Logout failed");
    } finally {
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  // =========================
  // RUN ON APP LOAD
  // =========================
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