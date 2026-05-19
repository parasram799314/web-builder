// src/routes/calendar.js
const express = require("express");
const router = express.Router();
const { getHolidays } = require("../controllers/calendarController");

// Public - fetch holidays for countries
router.get("/holidays", getHolidays);

module.exports = router;
