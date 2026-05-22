// src/routes/upload.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { upload, uploadLogo } = require("../controllers/uploadController");

// POST /api/upload/logo  →  upload logo image
router.post("/logo", verifyToken, requireRole(["admin", "agent", "user", "manager", "employee", "hr"]), upload.single("logo"), uploadLogo);

module.exports = router;
