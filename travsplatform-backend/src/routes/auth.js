const express = require("express");
const router = express.Router();
const { getAuth } = require("../config/firebase");

/**
 * POST /api/verify-token
 * Verifies a Firebase ID token sent from the dashboard.
 */
router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const auth = getAuth();
    // Verify the token using Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);
    
    // You can also check roles or other claims here
    // const uid = decodedToken.uid;

    res.json({
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      message: "Token verified successfully"
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
