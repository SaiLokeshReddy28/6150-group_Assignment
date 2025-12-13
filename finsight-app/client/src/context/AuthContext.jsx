// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

// Keys used in storage - ONLY STORE TOKEN
const TOKEN_KEY = "finsight_token";

// Helper: read token from storage
function getStoredToken() {
  if (typeof window === "undefined") return { token: null, rememberMe: false };
  try {
    const local = localStorage.getItem(TOKEN_KEY);
    if (local) return { token: local, rememberMe: true };

    const session = sessionStorage.getItem(TOKEN_KEY);
    if (session) return { token: session, rememberMe: false };
  } catch (err) {
    console.error("Error reading token:", err);
  }
  return { token: null, rememberMe: false };
}

// Helper: clear storages
function clearAuthStorage() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);

    // Cleanup old keys (legacy support)
    const oldKeys = [
      "finsight_user", "finsight_user_id", "finsight_user_name",
      "finsight_user_email", "finsight_user_role"
    ];
    oldKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch (err) {
    console.error("Error clearing storage:", err);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State
  useEffect(() => {
    const initAuth = async () => {
      // 1. Get token from storage
      const { token: storedToken, rememberMe: storedRemember } = getStoredToken();

      if (!storedToken) {
        // No token found -> definitely logged out
        setLoading(false);
        return;
      }

      // 2. Set token state first (so axios interceptor picks it up)
      setToken(storedToken);
      setRememberMe(storedRemember);

      // 3. Fetch User Details from Backend
      try {
        // We manually attach header here just in case state update is too slow for immediate effect
        // though usually axios interceptor reads from storage too. 
        // Best practice: rely on axios interceptor reading localStorage, OR pass explicit header.
        const res = await api.get("/auth/me");

        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        console.error("Failed to hydrate user session:", err);
        // Token invalid or expired -> logout
        clearAuthStorage();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData, jwtToken, remember) => {
    // 1. Save ONLY token to disk
    clearAuthStorage();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, jwtToken);

    // 2. Set state in memory
    setToken(jwtToken);
    setUser({
      _id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      ...userData // keep other fields if needed in memory
    });
    setRememberMe(!!remember);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRememberMe(false);
    clearAuthStorage();
    // Optional: reload page to clear any in-memory sensitive data in other components
    // window.location.reload(); 
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