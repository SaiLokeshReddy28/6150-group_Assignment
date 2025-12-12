// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Keys used in storage
const TOKEN_KEY = "finsight_token";
const USER_KEY = "finsight_user";

// Helper: read from storage on first load
function getStoredAuth() {
  if (typeof window === "undefined") {
    return { user: null, token: null, rememberMe: false };
  }

  try {
    // 1) Prefer persistent (localStorage)
    const localToken = localStorage.getItem(TOKEN_KEY);
    const localUser = localStorage.getItem(USER_KEY);
    if (localToken && localUser) {
      return {
        user: JSON.parse(localUser),
        token: localToken,
        rememberMe: true,
      };
    }
  } catch (err) {
    console.error("Error reading auth from localStorage:", err);
  }

  try {
    // 2) Fallback to sessionStorage
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    const sessionUser = sessionStorage.getItem(USER_KEY);
    if (sessionToken && sessionUser) {
      return {
        user: JSON.parse(sessionUser),
        token: sessionToken,
        rememberMe: false,
      };
    }
  } catch (err) {
    console.error("Error reading auth from sessionStorage:", err);
  }

  return { user: null, token: null, rememberMe: false };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);

  // On first load, hydrate from storage
  useEffect(() => {
    const { user: storedUser, token: storedToken, rememberMe: storedRemember } =
      getStoredAuth();
    setUser(storedUser);
    setToken(storedToken);
    setRememberMe(storedRemember);
    setLoading(false);
  }, []);

  const login = (userData, jwtToken, remember) => {
    setUser(userData);
    setToken(jwtToken);
    setRememberMe(!!remember);

    try {
      // Clear both storages so we don't have conflicting states
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);

      const serializedUser = JSON.stringify(userData);

      if (remember) {
        // 🔒 Persistent login
        localStorage.setItem(TOKEN_KEY, jwtToken);
        localStorage.setItem(USER_KEY, serializedUser);
      } else {
        // 🕒 Session-only login
        sessionStorage.setItem(TOKEN_KEY, jwtToken);
        sessionStorage.setItem(USER_KEY, serializedUser);
      }
    } catch (err) {
      console.error("Error saving auth to storage:", err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRememberMe(false);

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error("Error clearing auth from storage:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, rememberMe, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
