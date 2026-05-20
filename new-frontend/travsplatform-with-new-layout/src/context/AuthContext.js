// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import axiosInstance from "../utils/axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axiosInstance.get("/users/profile");
      if (response.data && response.data.user) {
        const { uid, email, role: userRole } = response.data.user;
        setCurrentUser({ uid, email });
        setRole(userRole);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("fb_token"); // Remove invalid token
    }
  };

  useEffect(() => {
    // 1. Token Extraction & Storage
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("fb_token", token);
      // Clean the URL
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in via Firebase Auth directly
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || "user");
          } else {
            setRole("user");
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          setRole("user");
        }
        setLoading(false);
      } else {
        // 3. Session Recovery & Profile Sync
        const storedToken = localStorage.getItem("fb_token");
        if (storedToken) {
          await fetchUserProfile(storedToken);
        } else {
          setCurrentUser(null);
          setRole(null);
        }
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const logout = () => {
    localStorage.removeItem("fb_token");
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

