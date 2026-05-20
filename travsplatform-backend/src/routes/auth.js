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
    // 1. Verify the ID Token from Dashboard
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Create a Custom Token for this user to log in on the Builder site
    const customToken = await auth.createCustomToken(uid);
    
    res.json({
      success: true,
      customToken,
      uid: uid,
      email: decodedToken.email,
      message: "SSO Token generated"
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
