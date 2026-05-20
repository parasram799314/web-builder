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
    const handleSSO = async () => {
      // 1. Token Extraction (Handles both ?token= and /token=)
      const queryParams = new URLSearchParams(window.location.search);
      let token = queryParams.get("token");

      // Check for /token= format if not found in query params (e.g. .../token=abc)
      if (!token && window.location.pathname.includes("token=")) {
        token = window.location.pathname.split("token=")[1];
      }

      if (token) {
        try {
          console.log("SSO Token detected, verifying...");
          const API_BASE = process.env.REACT_APP_API_URL;
          
          if (!API_BASE) {
             console.error("REACT_APP_API_URL missing for SSO verification");
             return;
          }

          const response = await fetch(`${API_BASE}/verify-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const { customToken } = await response.json();
            // 2. Sign in to Firebase with the Custom Token
            await signInWithCustomToken(auth, customToken);
            console.log("SSO Login Successful via Custom Token");
            
            // Clean the URL for security (remove token from path or query)
            const cleanUrl = window.location.origin + window.location.pathname.replace(/\/token=.*/, "");
            window.history.replaceState({}, document.title, cleanUrl);
          } else {
             console.error("SSO Verification failed on backend");
          }
        } catch (error) {
          console.error("SSO Process Error:", error);
        }
      }
    };

    handleSSO();

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
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

  const logout = () => {
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
