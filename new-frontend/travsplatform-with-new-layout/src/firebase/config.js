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
  apiKey: "AIzaSyCh_DEukwzsHiOzZeff5G_l7vHWsbZsVOY",
  authDomain: "tripplanner-f22be.firebaseapp.com",
  projectId: "tripplanner-f22be",
  storageBucket: "tripplanner-f22be.firebasestorage.app",
  messagingSenderId: "455181925668",
  appId: "1:455181925668:web:9098513c53f324ad0c87b1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
