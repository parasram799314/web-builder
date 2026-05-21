// src/firebase/config.js
// ─────────────────────────────────────────────────────────────────
//  REPLACE the values below with your own Firebase project config.
//  Steps:
//   1. Go to https://console.firebase.google.com
//   2. Create/open your project → Add a Web App → copy firebaseConfig
//   3. Enable Authentication → Email/Password provider
//   4. Enable Firestore Database (start in test mode for dev)
//   5. Enable Storage (for logo uploads)
// ─────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8c-sBdLvA-HoDXV_LrvEZlz0Y2oTSMFM",
  authDomain: "ticketing-a5ad5.firebaseapp.com",
  projectId: "ticketing-a5ad5",
  storageBucket: "ticketing-a5ad5.firebasestorage.app",
  messagingSenderId: "946048825410",
  appId: "1:946048825410:web:2b171b9579cabe73b815db",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
