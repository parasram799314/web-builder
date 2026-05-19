// src/controllers/contactController.js
const { getDb } = require("../config/firebase");
const admin = require("firebase-admin");

/**
 * POST /api/contact/:agentId
 * Public endpoint - submit a contact inquiry to an agent.
 * Saved in Firestore under "contact_inquiries" collection.
 * Body: { name, email, phone, message }
 */
async function submitInquiry(req, res) {
  try {
    const db = getDb();
    const { agentId } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Verify the agent's page exists and is published
    let pageSnap = await db.collection("website_pages").doc(agentId).get();
    
    // Fallback to calendar_pages
    if (!pageSnap.exists) {
      pageSnap = await db.collection("calendar_pages").doc(agentId).get();
    }

    if (!pageSnap.exists || !pageSnap.data().isPublished) {
      return res.status(404).json({ error: "Agent page not found" });
    }

    const inquiry = {
      agentId,
      agentEmail: pageSnap.data().email || "",
      name,
      email,
      phone: phone || "",
      message: message || "",
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    };

    const collectionName = process.env.CONTACT_COLLECTION || "contact_inquiries";
    const docRef = await db.collection(collectionName).add(inquiry);

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiryId: docRef.id,
    });
  } catch (err) {
    console.error("submitInquiry error:", err);
    return res.status(500).json({ error: "Failed to submit inquiry" });
  }
}

/**
 * GET /api/contact/inquiries
 * Protected - get all inquiries for the logged-in agent
 */
async function getInquiries(req, res) {
  try {
    const db = getDb();
    const collectionName = process.env.CONTACT_COLLECTION || "contact_inquiries";

    const snap = await db
      .collection(collectionName)
      .where("agentId", "==", req.user.uid)
      .orderBy("submittedAt", "desc")
      .limit(100)
      .get();

    const inquiries = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.() || null,
    }));

    return res.json({ inquiries });
  } catch (err) {
    console.error("getInquiries error:", err);
    return res.status(500).json({ error: "Failed to fetch inquiries" });
  }
}

/**
 * PATCH /api/contact/inquiries/:inquiryId/read
 * Protected - mark an inquiry as read
 */
async function markInquiryRead(req, res) {
  try {
    const db = getDb();
    const { inquiryId } = req.params;
    const collectionName = process.env.CONTACT_COLLECTION || "contact_inquiries";

    const ref = db.collection(collectionName).doc(inquiryId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    if (snap.data().agentId !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await ref.update({ read: true });

    return res.json({ success: true });
  } catch (err) {
    console.error("markInquiryRead error:", err);
    return res.status(500).json({ error: "Failed to update inquiry" });
  }
}

module.exports = { submitInquiry, getInquiries, markInquiryRead };
