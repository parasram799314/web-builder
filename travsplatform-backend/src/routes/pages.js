// src/routes/pages.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  getAllMyPages,
  getPage,
  savePage,
  publishPage,
  deletePage,
  getPublicPage,
} = require("../controllers/pagesController");

// ── Public ────────────────────────────────────────────────────────
// GET /api/pages/view/:pageId  →  public client-facing page
router.get("/view/:pageId", getPublicPage);

// ── Protected (requires Firebase auth token) ──────────────────────
// Apply role check for all following routes
router.use(verifyToken, requireRole(["admin", "agent"]));

// GET    /api/pages      →  list all agent's pages
router.get("/", getAllMyPages);

// GET    /api/pages/:pageId → get specific page
router.get("/:pageId", getPage);

// PUT    /api/pages/save   →  save/update draft (creates new if no pageId)
router.put("/save", savePage);

// POST   /api/pages/publish/:pageId → publish page
router.post("/publish/:pageId", publishPage);

// DELETE /api/pages/:pageId → delete page
router.delete("/:pageId", deletePage);

module.exports = router;
