const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

/**
 * GET /api/users/profile
 * Returns the authenticated user's profile and role.
 */
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = router;
