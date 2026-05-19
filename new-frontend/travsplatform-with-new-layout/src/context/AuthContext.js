// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, signInWithCustomToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const initializeAuth = async () => {
      if (token) {
        localStorage.setItem("fb_token", token);
        try {
          await signInWithCustomToken(auth, token);
          // Clean the URL
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
        } catch (error) {
          console.error("Error signing in with token:", error);
        }
      }
    };

    initializeAuth();

    const unsub = onAuthStateChanged(auth, async (user) => {
...
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || "user");
          } else {
            setRole("user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("user");
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
