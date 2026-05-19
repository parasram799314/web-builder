// src/controllers/pagesController.js
const { getDb, getStorage } = require("../config/firebase");
const admin = require("firebase-admin");

// Helper to get collection name based on pageType
function getCollectionName(pageType) {
  if (pageType === "calendar") return "calendar_pages";
  return "website_pages"; // Default to website_pages
}

/**
 * GET /api/pages
 * List all pages for the logged-in agent
 */
async function getAllMyPages(req, res) {
  try {
    const db = getDb();
    const pageType = req.query.type || "website";
    const collection = getCollectionName(pageType);

    const snap = await db.collection(collection)
      .where("userId", "==", req.user.uid)
      .get();

    const pages = [];
    snap.forEach(doc => {
      pages.push({ id: doc.id, ...doc.data() });
    });

    pages.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
      const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
      return timeB - timeA;
    });

    return res.json({ pages });
  } catch (err) {
    console.error("getAllMyPages error:", err);
    return res.status(500).json({ error: "Failed to fetch pages" });
  }
}

/**
 * GET /api/pages/:pageId
 */
async function getPage(req, res) {
  try {
    const db = getDb();
    const { pageId } = req.params;
    const pageType = req.query.type || "website";
    const collection = getCollectionName(pageType);

    const snap = await db.collection(collection).doc(pageId).get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Page not found" });
    }

    const data = snap.data();
    if (data.userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json({ page: { id: snap.id, ...data } });
  } catch (err) {
    console.error("getPage error:", err);
    return res.status(500).json({ error: "Failed to fetch page data" });
  }
}

/**
 * PUT /api/pages/save
 */
async function savePage(req, res) {
  try {
    const db = getDb();
    const { pageId, pageName, pageType } = req.body;
    const collection = getCollectionName(pageType);
    
    const allowed = [
      "branding", "countries", "packages", "showContactForm", "calendarYear",
      "slug", "themeColor", "activeLayout", "hero", "sections", "contactFields",
      "pageName", "pageType", "extraPages", "widgets", "hiddenWidgets",
      "flightMargin", "hotelMargin", "calendarTheme", "selectedCalendars",
      "subpageContents", "fontFamily"
    ];

    const draft = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) draft[key] = req.body[key];
    });

    let ref;
    if (pageId) {
      ref = db.collection(collection).doc(pageId);
      const existing = await ref.get();
      if (existing.exists && existing.data().userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } else {
      ref = db.collection(collection).doc();
    }

    const updateData = {
      draft,
      userId: req.user.uid,
      email: req.user.email || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      pageType: pageType || "website"
    };

    const existingSnap = await ref.get();
    if (!existingSnap.exists) {
      updateData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      updateData.isPublished = false;
      updateData.pageName = pageName || "Untitled Page";
    } else if (pageName) {
      updateData.pageName = pageName;
    }

    await ref.set(updateData, { merge: true });
    return res.json({ success: true, pageId: ref.id });
  } catch (err) {
    console.error("savePage error:", err);
    return res.status(500).json({ error: "Failed to save page" });
  }
}

/**
 * POST /api/pages/publish/:pageId
 */
async function publishPage(req, res) {
  try {
    const db = getDb();
    const { pageId } = req.params;
    const { pageName, pageType } = req.body;
    const collection = getCollectionName(pageType);

    const ref = db.collection(collection).doc(pageId);
    const snap = await ref.get();

    if (!snap.exists) return res.status(404).json({ error: "Not found" });
    if (snap.data().userId !== req.user.uid) return res.status(403).json({ error: "Unauthorized" });

    const draft = snap.data().draft || {};
    const updatePayload = {
      publishedVersion: draft,
      isPublished: true,
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      pageType: pageType || "website"
    };

    if (pageName) updatePayload.pageName = pageName;

    await ref.set(updatePayload, { merge: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("publishPage error:", err);
    return res.status(500).json({ error: "Failed to publish" });
  }
}

/**
 * DELETE /api/pages/:pageId
 */
async function deletePage(req, res) {
  try {
    const db = getDb();
    const { pageId } = req.params;
    const pageType = req.query.type || "website";
    const collection = getCollectionName(pageType);

    const ref = db.collection(collection).doc(pageId);
    const snap = await ref.get();

    if (!snap.exists) return res.status(404).json({ error: "Not found" });
    if (snap.data().userId !== req.user.uid) return res.status(403).json({ error: "Unauthorized" });

    await ref.delete();
    return res.json({ success: true });
  } catch (err) {
    console.error("deletePage error:", err);
    return res.status(500).json({ error: "Failed to delete" });
  }
}

/**
 * GET /api/pages/view/:pageId
 * Public endpoint - check both collections
 */
async function getPublicPage(req, res) {
  try {
    const db = getDb();
    const { pageId } = req.params;
    const mode = req.query.mode || "website";
    const collection = getCollectionName(mode);

    let snap = await db.collection(collection).doc(pageId).get();
    
    // Fallback search if mode doesn't match the collection it was saved in
    if (!snap.exists) {
        const otherCollection = (collection === "website_pages") ? "calendar_pages" : "website_pages";
        snap = await db.collection(otherCollection).doc(pageId).get();
    }

    if (!snap.exists) return res.status(404).json({ error: "Page not found" });

    const data = snap.data();
    if (!data.isPublished) return res.status(403).json({ error: "Not published" });

    const published = data.publishedVersion || {};
    // Inject userId so agentId works in layouts
    published.userId = data.userId;
    // Ensure subpageContents is always present (even for older pages)
    if (!published.subpageContents) published.subpageContents = {};

    return res.json({ page: published, pageName: data.pageName });
  } catch (err) {
    console.error("getPublicPage error:", err);
    return res.status(500).json({ error: "Failed to fetch page" });
  }
}

module.exports = { getAllMyPages, getPage, savePage, publishPage, deletePage, getPublicPage };