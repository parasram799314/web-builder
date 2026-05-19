// src/middleware/auth.js
const { getAuth, getDb } = require("../config/firebase");

/**
 * Middleware: verifies Firebase ID token from Authorization header.
 * Sets req.user = { uid, email, role } on success.
 */
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(idToken);

    // Fetch user role from Firestore
    const userDoc = await getDb().collection("users").doc(decoded.uid).get();
    const role = userDoc.exists ? (userDoc.data().role || "user") : "user";

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: role
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}

/**
 * Middleware: restricts access based on allowed roles.
 * Must be used AFTER verifyToken.
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
