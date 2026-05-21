// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dns = require("dns");
const path = require("path");

// Force IPv4 to avoid network unreachable errors on some IPv6-enabled networks
dns.setDefaultResultOrder("ipv4first");

const { initFirebase } = require("./config/firebase");

// ── Init Firebase Admin ───────────────────────────────────────────
initFirebase();

// ── App setup ─────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Logging middleware ─────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to allow external images/scripts easily
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan("dev"));

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      // Also allow any .vercel.app subdomain for easier deployment
      if (
        !origin || 
        allowedOrigins.includes(origin) || 
        (origin.endsWith(".vercel.app")) ||
        (process.env.NODE_ENV !== "production")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// ── Body parsers ──────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ── Rate limiting ─────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: "Too many requests. Please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: "Too many inquiries submitted. Please try again later." },
});

app.use("/api/", generalLimiter);
app.use("/api/contact/:agentId", contactLimiter);

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/pages", require("./routes/pages"));
app.use("/api/packages", require("./routes/packages"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/calendar", require("./routes/calendar"));
app.use("/api/email", require("./routes/email"));
app.use("/api/users", require("./routes/users"));
app.use("/api", require("./routes/auth"));

// ── Static Files (Frontend Build) ─────────────────────────────────
const buildPath = path.resolve(__dirname, "../../new-frontend/travsplatform-with-new-layout/build");
console.log("Serving static files from:", buildPath);
app.use(express.static(buildPath));

// ── Health check ──────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── SPA Catch-all (Send index.html for unknown frontend routes) ───
app.get("*", (req, res, next) => {
  // If request is for /api/*, it should have been caught by the routes above
  if (req.path.startsWith("/api/")) {
    console.warn(`404 API Route: ${req.method} ${req.path}`);
    return next();
  }
  
  const indexPath = path.join(buildPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      // If index.html doesn't exist (e.g. no build yet), fallback to 404
      next();
    }
  });
});

// ── 404 handler (Only for /api/* if not matched above) ────────────
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found", 
    path: req.path,
    method: req.method
  });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ── Start server ──────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Travsplatform backend running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health\n`);
  });
}

module.exports = app;
