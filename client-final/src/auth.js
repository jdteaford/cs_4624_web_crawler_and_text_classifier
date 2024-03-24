import React, { createContext, useContext, useState } from 'react';

const auth = createContext();

export function useAuth() {
  return useContext(auth);
}

export const AuthProvider = ({ children }) => {
    const[currentUser, setCurrentUser] = useState(null);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const value = {
    isLoggedIn,
    login,
    logout
  };

  return <auth.Provider value={value}>{children}</auth.Provider>;
};
