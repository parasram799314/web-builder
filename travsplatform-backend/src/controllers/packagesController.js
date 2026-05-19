// src/controllers/packagesController.js
const { getDb } = require("../config/firebase");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

/**
 * GET /api/packages
 * Get all packages for the logged-in agent from the dedicated agent_packages collection
 */
async function getPackages(req, res) {
  try {
    const db = getDb();
    const snap = await db.collection("agent_packages").doc(req.user.uid).get();

    if (!snap.exists) {
      // Fallback: check the old location if needed, or return empty
      return res.json({ packages: [] });
    }

    return res.json({ packages: snap.data().packages || [] });
  } catch (err) {
    console.error("getPackages error:", err);
    return res.status(500).json({ error: "Failed to fetch packages" });
  }
}

/**
 * POST /api/packages
 */
async function addPackage(req, res) {
  try {
    const db = getDb();
    const { 
      title, description, price, duration, image, highlights, 
      months, countries, showInOthers, detailsLink, originalPrice, 
      startMonth, endMonth, month, type, days, nights 
    } = req.body;

    const newPackage = {
      id: req.body.id || uuidv4(),
      title: title || "New Package",
      description: description || "",
      price: price || "",
      originalPrice: originalPrice || "",
      duration: duration || "",
      days: days || "",
      nights: nights || "",
      image: image || "",
      highlights: highlights || [],
      months: months || [],
      countries: countries || [],
      showInOthers: !!showInOthers,
      detailsLink: detailsLink || "",
      startMonth: startMonth || "",
      endMonth: endMonth || "",
      month: month || "",
      type: type || "Nature",
      createdAt: new Date().toISOString(),
    };

    const ref = db.collection("agent_packages").doc(req.user.uid);
    await ref.set(
      {
        packages: admin.firestore.FieldValue.arrayUnion(newPackage),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.status(201).json({ success: true, package: newPackage });
  } catch (err) {
    console.error("addPackage error:", err);
    return res.status(500).json({ error: "Failed to add package" });
  }
}

/**
 * PUT /api/packages/:packageId
 */
async function updatePackage(req, res) {
  try {
    const db = getDb();
    const { packageId } = req.params;

    const ref = db.collection("agent_packages").doc(req.user.uid);
    const snap = await ref.get();

    let packages = [];
    if (snap.exists) {
      packages = snap.data().packages || [];
    }

    const idx = packages.findIndex((p) => p.id === packageId);

    if (idx === -1) {
      // If package not found in DB (e.g. editing a default one or first time saving), treat as NEW
      const newPackage = {
        ...req.body,
        id: packageId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await ref.set(
        {
          packages: admin.firestore.FieldValue.arrayUnion(newPackage),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return res.json({ success: true, package: newPackage, note: "added as new" });
    }

    // Existing package found, update it
    packages[idx] = { 
      ...packages[idx], 
      ...req.body, 
      id: packageId, 
      updatedAt: new Date().toISOString() 
    };

    await ref.set({ packages, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

    return res.json({ success: true, package: packages[idx] });
  } catch (err) {
    console.error("updatePackage error:", err);
    return res.status(500).json({ error: "Failed to update package" });
  }
}

/**
 * DELETE /api/packages/:packageId
 */
async function deletePackage(req, res) {
  try {
    const db = getDb();
    const { packageId } = req.params;

    const ref = db.collection("agent_packages").doc(req.user.uid);
    const snap = await ref.get();

    if (!snap.exists) return res.status(404).json({ error: "Not found" });

    const packages = (snap.data().packages || []).filter((p) => p.id !== packageId);

    await ref.set({ packages, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

    return res.json({ success: true });
  } catch (err) {
    console.error("deletePackage error:", err);
    return res.status(500).json({ error: "Failed to delete package" });
  }
}

module.exports = { getPackages, addPackage, updatePackage, deletePackage };
