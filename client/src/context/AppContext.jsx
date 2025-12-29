import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const loginSuccess = (user) => {
    setIsLoggedin(true);
    setUserData(user);
  };

  const logout = () => {
    setIsLoggedin(false);
    setUserData(null);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedin,
        userData,
        loadingUser,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};