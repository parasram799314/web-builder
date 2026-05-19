// src/routes/contact.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  submitInquiry,
  getInquiries,
  markInquiryRead,
} = require("../controllers/contactController");

// ── Public ────────────────────────────────────────────────────────
// POST /api/contact/:agentId  →  client submits inquiry to agent
router.post("/:agentId", submitInquiry);

// ── Protected ─────────────────────────────────────────────────────
// Apply role check for following routes
router.use(verifyToken, requireRole(["admin", "agent"]));

// GET   /api/contact/inquiries               →  agent's all inquiries
router.get("/inquiries", getInquiries);

// PATCH /api/contact/inquiries/:id/read      →  mark inquiry as read
router.patch("/inquiries/:inquiryId/read", markInquiryRead);

module.exports = router;
