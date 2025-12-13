// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Keys used in storage - ONLY STORE ESSENTIAL DATA
const TOKEN_KEY = "finsight_token";
const USER_ID_KEY = "finsight_user_id";
const USER_NAME_KEY = "finsight_user_name";
const USER_EMAIL_KEY = "finsight_user_email";
const USER_ROLE_KEY = "finsight_user_role";

// OLD KEY - TO BE REMOVED (legacy cleanup)
const OLD_USER_KEY = "finsight_user";

// Helper: read from storage on first load
function getStoredAuth() {
  if (typeof window === "undefined") {
    return { user: null, token: null, rememberMe: false };
  }

  try {
    // 1) Prefer persistent (localStorage)
    const localToken = localStorage.getItem(TOKEN_KEY);
    const localUserId = localStorage.getItem(USER_ID_KEY);
    const localUserName = localStorage.getItem(USER_NAME_KEY);
    const localUserEmail = localStorage.getItem(USER_EMAIL_KEY);
    const localUserRole = localStorage.getItem(USER_ROLE_KEY);
    
    if (localToken && localUserId) {
      return {
        user: {
          _id: localUserId,
          name: localUserName,
          email: localUserEmail,
          role: localUserRole || "user",
        },
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
    const sessionUserId = sessionStorage.getItem(USER_ID_KEY);
    const sessionUserName = sessionStorage.getItem(USER_NAME_KEY);
    const sessionUserEmail = sessionStorage.getItem(USER_EMAIL_KEY);
    const sessionUserRole = sessionStorage.getItem(USER_ROLE_KEY);
    
    if (sessionToken && sessionUserId) {
      return {
        user: {
          _id: sessionUserId,
          name: sessionUserName,
          email: sessionUserEmail,
          role: sessionUserRole || "user",
        },
        token: sessionToken,
        rememberMe: false,
      };
    }
  } catch (err) {
    console.error("Error reading auth from sessionStorage:", err);
  }

  return { user: null, token: null, rememberMe: false };
}

// Helper: clear all auth data from both storages
function clearAuthStorage() {
  try {
    // Remove NEW format keys
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(USER_NAME_KEY);
    sessionStorage.removeItem(USER_EMAIL_KEY);
    sessionStorage.removeItem(USER_ROLE_KEY);
    
    // 🧹 REMOVE OLD FORMAT (cleanup legacy data)
    localStorage.removeItem(OLD_USER_KEY);
    sessionStorage.removeItem(OLD_USER_KEY);
  } catch (err) {
    console.error("Error clearing auth storage:", err);
  }
}

// Helper: cleanup old storage format on app load
function cleanupOldStorage() {
  try {
    // If old format exists, remove it
    const oldData = localStorage.getItem(OLD_USER_KEY);
    if (oldData) {
      console.log("🧹 Removing old finsight_user key...");
      localStorage.removeItem(OLD_USER_KEY);
    }
    
    const oldSessionData = sessionStorage.getItem(OLD_USER_KEY);
    if (oldSessionData) {
      console.log("🧹 Removing old finsight_user from session...");
      sessionStorage.removeItem(OLD_USER_KEY);
    }
  } catch (err) {
    console.error("Error cleaning old storage:", err);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);

  // On first load, cleanup old format and hydrate from storage
  useEffect(() => {
    // 🧹 Clean up old storage format FIRST
    cleanupOldStorage();
    
    const { user: storedUser, token: storedToken, rememberMe: storedRemember } =
      getStoredAuth();
    setUser(storedUser);
    setToken(storedToken);
    setRememberMe(storedRemember);
    setLoading(false);
  }, []);

  const login = (userData, jwtToken, remember) => {
    // Extract ONLY essential user data (not entire object)
    const minimalUser = {
      _id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
    };

    setUser(minimalUser);
    setToken(jwtToken);
    setRememberMe(!!remember);

    try {
      // Clear both storages first to avoid conflicts (including old format)
      clearAuthStorage();

      const storage = remember ? localStorage : sessionStorage;

      // Store ONLY essential data separately (not as JSON object)
      storage.setItem(TOKEN_KEY, jwtToken);
      storage.setItem(USER_ID_KEY, minimalUser._id);
      storage.setItem(USER_NAME_KEY, minimalUser.name);
      storage.setItem(USER_EMAIL_KEY, minimalUser.email);
      storage.setItem(USER_ROLE_KEY, minimalUser.role);
      
      console.log("✅ Auth stored with minimal data format");
    } catch (err) {
      console.error("Error saving auth to storage:", err);
    }
  };

  const logout = () => {
    // Clear state immediately
    setUser(null);
    setToken(null);
    setRememberMe(false);

    // Clear all auth data from storage (including old format)
    clearAuthStorage();

    console.log("✅ User logged out, all storage cleared");
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, rememberMe, loading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};