const express = require("express");
const router = express.Router();
const { sendReactEmail } = require("../utils/emailSender");
const { verifyToken } = require("../middleware/auth");

// POST /api/email/send
router.post("/send", verifyToken, async (req, res) => {
  const { to, subject, templateId, data, color } = req.body;

  if (!to || !templateId) {
    return res.status(400).json({ error: "Missing recipient or template ID" });
  }

  // Map template IDs to their file paths
  const templateMap = {
    "confirm-1": "../../../new-frontend/travsplatform-with-new-layout/src/components/EmailBuilder/confirmations/first.jsx",
    "promo-1": "../../../new-frontend/travsplatform-with-new-layout/src/components/EmailBuilder/promotions/one.jsx",
    "promo-2": "../../../new-frontend/travsplatform-with-new-layout/src/components/EmailBuilder/promotions/second.jsx",
  };

  const componentPath = templateMap[templateId];

  if (!componentPath) {
    return res.status(404).json({ error: "Template component not found" });
  }

  try {
    console.log(`Attempting to send email to ${to} using template ${templateId} with color ${color}`);
    const result = await sendReactEmail(to, subject || "Your Travel Details", componentPath, { data, color });
    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error("❌ ROUTE ERROR:", error);
    res.status(500).json({ 
      error: "Failed to send email", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
