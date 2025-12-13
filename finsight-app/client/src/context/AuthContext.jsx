// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Keys used in storage - ONLY STORE ESSENTIAL DATA
const TOKEN_KEY = "finsight_token";
const USER_ID_KEY = "finsight_user_id";
const USER_NAME_KEY = "finsight_user_name";
const USER_EMAIL_KEY = "finsight_user_email";
const USER_ROLE_KEY = "finsight_user_role";

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
    // Remove specific auth keys from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    
    // Remove specific auth keys from sessionStorage
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(USER_NAME_KEY);
    sessionStorage.removeItem(USER_EMAIL_KEY);
    sessionStorage.removeItem(USER_ROLE_KEY);
  } catch (err) {
    console.error("Error clearing auth storage:", err);
  }
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
      // Clear both storages first to avoid conflicts
      clearAuthStorage();

      const storage = remember ? localStorage : sessionStorage;

      // Store ONLY essential data separately (not as JSON object)
      storage.setItem(TOKEN_KEY, jwtToken);
      storage.setItem(USER_ID_KEY, minimalUser._id);
      storage.setItem(USER_NAME_KEY, minimalUser.name);
      storage.setItem(USER_EMAIL_KEY, minimalUser.email);
      storage.setItem(USER_ROLE_KEY, minimalUser.role);
    } catch (err) {
      console.error("Error saving auth to storage:", err);
    }
  };

  const logout = () => {
    // Clear state immediately
    setUser(null);
    setToken(null);
    setRememberMe(false);

    // Clear all auth data from storage
    clearAuthStorage();

    // Note: Navigation handled by component calling logout
    console.log("✅ User logged out, storage cleared");
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