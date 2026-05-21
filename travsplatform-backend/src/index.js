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

// ── CORS (Must be applied BEFORE any routes or other middleware) ──
const allowedOrigins = [
  "https://web-builder-nu-three.vercel.app",
  "http://localhost:3000",
  ... (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim()).filter(o => o)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(o => 
        origin === o || origin.endsWith(".vercel.app")
      );

      if (isAllowed || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        console.error("CORS Blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// ── Security & Logging middleware ─────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan("dev"));

// ── Body parsers ──────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ── Rate limiting ─────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests. Please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
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
app.use(express.static(buildPath));

// ── Health check ──────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── SPA Catch-all ─────────────────────────────────────────────────
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  const indexPath = path.join(buildPath, "index.html");
  res.sendFile(indexPath, (err) => { if (err) next(); });
});

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path, method: req.method });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// ── Start server ──────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Travsplatform backend running on port ${PORT}`);
  });
}

module.exports = app;
