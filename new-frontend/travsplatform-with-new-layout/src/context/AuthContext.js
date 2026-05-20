import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, signInWithCustomToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSSOProcessing, setIsSSOProcessing] = useState(false);

  useEffect(() => {
    const handleSSO = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      let token = queryParams.get("token");

      if (!token && window.location.pathname.includes("token=")) {
        token = window.location.pathname.split("token=")[1];
      }

      if (token) {
        setIsSSOProcessing(true);
        setLoading(true);
        try {
          console.log("SSO Token detected, verifying...");
          const API_BASE = process.env.REACT_APP_API_URL;
          
          if (!API_BASE) {
             console.error("REACT_APP_API_URL missing for SSO verification");
             setIsSSOProcessing(false);
             return;
          }

          const response = await fetch(`${API_BASE}/verify-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const { customToken } = await response.json();
            await signInWithCustomToken(auth, customToken);
            console.log("SSO Login Successful via Custom Token");
            
            const url = new URL(window.location);
            url.searchParams.delete("token");
            const cleanPath = url.pathname.replace(/\/token=.*/, "");
            window.history.replaceState({}, document.title, url.origin + cleanPath + url.search);
          } else {
             console.error("SSO Verification failed on backend");
          }
        } catch (error) {
          console.error("SSO Process Error:", error);
        } finally {
          setIsSSOProcessing(false);
        }
      }
    };

    handleSSO();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const idToken = await user.getIdToken();
        localStorage.setItem("fb_token", idToken);
        
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
        localStorage.removeItem("fb_token");
      }
      
      if (!isSSOProcessing) {
        setLoading(false);
      }
    });

    return unsub;
  }, [isSSOProcessing]);

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
