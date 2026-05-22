// src/routes/packages.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  getPackages,
  addPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packagesController");

// All package routes require auth and specific roles
router.use(verifyToken, requireRole(["admin", "agent", "user", "manager", "employee", "hr"]));

// GET    /api/packages           →  get all packages for agent
router.get("/", getPackages);

// POST   /api/packages           →  add new package
router.post("/", addPackage);

// PUT    /api/packages/:packageId  →  update a package
router.put("/:packageId", updatePackage);

// DELETE /api/packages/:packageId  →  delete a package
router.delete("/:packageId", deletePackage);

module.exports = router;
