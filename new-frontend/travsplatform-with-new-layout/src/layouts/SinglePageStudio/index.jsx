// src/layouts/SinglePageStudio/index.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PackagesList from "../../components/Packages/PackagesList";
import Calendar from "../../components/Calendar/Calendar";
import FlightSection from "../../components/TravelServices/FlightSection";
import HotelSection from "../../components/TravelServices/HotelSection";

// ─── CSS (injected once) ──────────────────────────────────────────────────────
const STUDIO_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.sps-layout { font-family: 'DM Sans', sans-serif; background: #FAFAF8; color: #1a1f3c; }
.sps-layout h1, .sps-layout h2, .sps-layout h3, .sps-layout h4 { font-family: 'Playfair Display', serif; }

/* Fade-in animation */
@keyframes sps-fadeup { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
.sps-fadeup { animation: sps-fadeup 0.6s ease both; }
.sps-fadeup-d1 { animation-delay: 0.15s; }
.sps-fadeup-d2 { animation-delay: 0.3s; }
.sps-fadeup-d3 { animation-delay: 0.45s; }
.sps-fadeup-d4 { animation-delay: 0.6s; }

/* Reveal on scroll */
.sps-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
.sps-reveal.sps-visible { opacity: 1; transform: translateY(0); }

/* Card hover */
.sps-pkg-card { transition: box-shadow 0.3s, transform 0.3s; }
.sps-pkg-card:hover { box-shadow: 0 20px 48px rgba(0,0,0,0.12); transform: translateY(-4px); }
.sps-pkg-card .sps-pkg-img { transition: transform 0.5s ease; }
.sps-pkg-card:hover .sps-pkg-img { transform: scale(1.06); }

/* Input focus */
.sps-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(85,140,210,0.2); }
.sps-textarea:focus { outline: none; box-shadow: 0 0 0 3px rgba(85,140,210,0.2); }

/* Feature card */
.sps-feature-card:hover { border-color: rgba(85,140,210,0.35); }
`;

function injectSPSCSS() {
  if (document.getElementById("sps-layout-css")) return;
  const s = document.createElement("style");
  s.id = "sps-layout-css";
  s.textContent = STUDIO_CSS;
  document.head.appendChild(s);
}

// ─── Editable Text Wrapper ────────────────────────────────────────────────────
function EditableText({ value, onSave, isAdmin, className, style = {}, tag: Tag = "span", multiline = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => { setTempValue(value); }, [value]);

  if (!isAdmin) return <Tag className={className} style={style}>{value}</Tag>;

  if (isEditing) {
    const commonStyle = {
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      color: "inherit",
      background: "rgba(0,0,0,0.1)",
      border: "1px dashed rgba(0,0,0,0.3)",
      width: "100%",
      outline: "none",
      padding: "2px 4px",
      borderRadius: "4px",
      ...style
    };

    return multiline ? (
      <textarea
        autoFocus
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        className={className}
        style={commonStyle}
        rows={3}
      />
    ) : (
      <input
        autoFocus
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(tempValue); }}
        onKeyDown={(e) => { if (e.key === "Enter") { setIsEditing(false); onSave(tempValue); } }}
        className={className}
        style={commonStyle}
      />
    );
  }

  return (
    <Tag
      className={`${className} cursor-text hover:bg-black/5 transition-colors rounded`}
      style={style}
      onDoubleClick={() => setIsEditing(true)}
      title="Double click to edit"
    >
      {value}
    </Tag>
  );
}

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sps-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("sps-visible"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ─── Color system (maps admin themeColor to CSS vars inline) ──────────────────
function getColors(themeColor) {
  const c = themeColor || "#558cd2";
  return {
    primary: c,
    primaryFg: "#ffffff",
    accent: "#D97B45",      // travel-sunset equivalent
    sand: "#E8DCC8",
    bg: "#FAFAF8",
    card: "#FFFFFF",
    muted: "#F2F0EC",
    mutedFg: "#6B7280",
    fg: "#1a1f3c",
    border: "#E8E4DC",
    dark: "#1a1f3c",
  };
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function SPSNavbar({ branding, themeColor, isAdmin, onUpdate, extraPages = [], pageId, onPageClick }) {
  const [scrolled, setScrolled] = useState(false);
  const colors = getColors(themeColor);

  const PAGE_MAP = {
    about: "About",
    blog: "Blog",
    help: "Help",
    contact_page: "Contact",
    privacy: "Privacy",
    terms: "Terms"
  };

  const homeUrl = pageId ? `/view/${pageId}` : "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const brandVal = branding?.value || "/logo3.png";
  const brandType = branding?.type || "logo";

  // In admin mode, we want to prevent navigation and instead use onPageClick if provided
  const LinkComponent = isAdmin ? "button" : Link;
  const getProps = (to, subPageId = null) => {
    if (isAdmin) {
      return {
        onClick: (e) => {
          e.preventDefault();
          if (subPageId) {
            if (onPageClick) onPageClick(subPageId);
          } else if (to.includes("#")) {
            const hash = to.split("#")[1];
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          } else {
            if (onPageClick) onPageClick(null);
          }
        },
        style: { background: "none", border: "none", cursor: "pointer", padding: 0 }
      };
    }
    return { to };
  };

  return (
    <nav style={{
      position: "sticky", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.82)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${colors.border}`,
      transition: "background 0.3s",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LinkComponent {...getProps(homeUrl)} style={{ width: 36, height: 36, borderRadius: 10, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "none", cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </LinkComponent>
          {brandType === "logo" && branding?.value ? (
            <LinkComponent {...getProps(homeUrl)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <img src={branding.value} alt="Logo" style={{ height: 32, objectFit: "contain" }} />
            </LinkComponent>
          ) : (
            <EditableText 
              value={brandVal} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("branding", "value", v)} 
              tag="span"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: colors.fg }}
            />
          )}
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Packages", "Calendar", "Contact"].map((l) => (
             <LinkComponent key={l} {...getProps(`${homeUrl}#sps-${l.toLowerCase()}`)} style={{ fontSize: 14, fontWeight: 600, color: colors.mutedFg, textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
               {l}
             </LinkComponent>
          ))}
          {extraPages.map((pId) => (
            <LinkComponent 
              key={pId} 
              {...getProps(`${homeUrl}?subPage=${pId}`, pId)}
              style={{ fontSize: 14, fontWeight: 600, color: colors.primary, textDecoration: "none", paddingLeft: 12, borderLeft: `1px solid ${colors.border}`, background: "none", border: "none", cursor: "pointer" }}
            >
              {PAGE_MAP[pId] || pId}
            </LinkComponent>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function SPSHero({ themeColor, data, isAdmin, onUpdate }) {
  const colors = getColors(themeColor);

  const title = data?.title || "Discover India's Hidden Gems";
  const subtitle = data?.subtitle || "Curated holiday packages with the best deals across beaches, mountains, heritage cities, and more.";

  const scrollToCalendar = () => {
    const el = document.getElementById("sps-calendar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="/assets/hero-travel.jpg"
          alt="Hero"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.target.style.background = "linear-gradient(135deg, #1a1f3c 0%, #2d4a8a 100%)"; e.target.style.display = "none"; }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,31,60,0.6) 0%, rgba(26,31,60,0.3) 50%, rgba(26,31,60,0.7) 100%)" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <p className="sps-fadeup" style={{ color: colors.sand, fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
          India's Premium Travel Platform
        </p>
        <EditableText 
          value={title} 
          isAdmin={isAdmin} 
          onSave={(v) => onUpdate("hero", "title", v)} 
          tag="h1"
          className="sps-fadeup sps-fadeup-d1"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20, display: "block" }}
        />
        <EditableText 
          value={subtitle} 
          isAdmin={isAdmin} 
          onSave={(v) => onUpdate("hero", "subtitle", v)} 
          tag="p"
          multiline
          className="sps-fadeup sps-fadeup-d2"
          style={{ color: "rgba(255,255,255,0.8)", fontSize: 17, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.65, display: "block" }}
        />

        <div className="sps-fadeup sps-fadeup-d3" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button 
            onClick={scrollToCalendar}
            style={{ 
              background: colors.primary, color: "#fff", border: "none", padding: "14px 32px", 
              borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", 
              boxShadow: `0 10px 24px ${colors.primary}40`, transition: "transform 0.3s" 
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            View Calendar
          </button>
          <div style={{ 
            display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", 
            backdropFilter: "blur(10px)", padding: "14px 24px", borderRadius: 12, 
            border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 14, fontWeight: 500 
          }}>
            <span style={{ color: colors.accent }}>🔥</span> Special 50% Offer Today
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Packages Section ─────────────────────────────────────────────────────────
function SPSPackages({ packages, themeColor, isAdmin, data, onUpdate }) {
  useReveal();
  const colors = getColors(themeColor);
  const displayPkgs = packages || [];

  const title = data?.title || "Smart Package Recommendations";
  const subtitle = data?.subtitle || "Curated For You";
  const description = data?.description || "Hand-picked destinations with unbeatable prices and unforgettable experiences.";

  return (
    <section id="sps-packages" style={{ padding: "80px 24px", background: colors.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Heading */}
        <div className="sps-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ color: colors.primary, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
            <EditableText 
              value={subtitle} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("packages", "subtitle", v)} 
            />
          </p>
          <EditableText 
            value={title} 
            isAdmin={isAdmin} 
            onSave={(v) => onUpdate("packages", "title", v)} 
            tag="h2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: colors.fg, margin: "0 0 12px", display: "block" }}
          />
          <EditableText 
            value={description} 
            isAdmin={isAdmin} 
            onSave={(v) => onUpdate("packages", "description", v)} 
            tag="p"
            multiline
            style={{ color: colors.mutedFg, maxWidth: 480, margin: "0 auto", lineHeight: 1.6, fontSize: 15, display: "block" }}
          />
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {displayPkgs.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px 0", color: colors.mutedFg }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <p>No packages found for this month.</p>
            </div>
          ) : displayPkgs.map((pkg, i) => (
            <div
              key={pkg.id || i}
              className={`sps-pkg-card sps-reveal`}
              style={{ background: colors.card, borderRadius: 20, overflow: "hidden", border: `1px solid ${colors.border}`, animationDelay: `${i * 0.1}s` }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 208, overflow: "hidden" }}>
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="sps-pkg-img"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.background = "#e5e7eb"; e.target.style.display = "none"; }}
                />
                {pkg.tag && (
                  <span style={{ position: "absolute", top: 12, left: 12, background: `${colors.primary}e6`, color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                    {pkg.tag}
                  </span>
                )}
              </div>
              {/* Body */}
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: colors.fg, margin: 0 }}>
                    {pkg.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, color: colors.accent }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{pkg.rating || "4.8"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: colors.mutedFg, fontSize: 13, marginBottom: 16 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {pkg.duration}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price) && (
                      <span style={{ fontSize: 12, color: "#ef4444", textDecoration: "line-through", fontWeight: 500 }}>
                        ₹{Number(pkg.originalPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                    <span style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>
                      ₹{Number(pkg.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: colors.primary, background: "none", border: "none", cursor: "pointer" }}>
                    View Details
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🛡️", title: "Secure Booking", desc: "100% safe payments with instant confirmation" },
  { icon: "🎧", title: "24/7 Support", desc: "Round-the-clock assistance for every traveler" },
  { icon: "💳", title: "Best Price Guarantee", desc: "We match any lower price you find elsewhere" },
  { icon: "🌏", title: "500+ Destinations", desc: "Explore curated packages across India" },
];

function SPSFeatures({ themeColor, data, isAdmin, onUpdate }) {
  useReveal();
  const colors = getColors(themeColor);

  const title = data?.title || "Travel With Confidence";
  const subtitle = data?.subtitle || "Why Choose Us";

  return (
    <section style={{ padding: "80px 24px", background: colors.muted }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="sps-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ color: colors.primary, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
            <EditableText 
              value={subtitle} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("features", "subtitle", v)} 
            />
          </p>
          <EditableText 
            value={title} 
            isAdmin={isAdmin} 
            onSave={(v) => onUpdate("features", "title", v)} 
            tag="h2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: colors.fg, margin: 0, display: "block" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="sps-feature-card sps-reveal"
              style={{ background: colors.card, borderRadius: 20, padding: 24, textAlign: "center", border: `1px solid ${colors.border}`, transition: "border-color 0.3s" }}
            >
              <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: 16, background: `${colors.primary}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: colors.fg, margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: colors.mutedFg, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function SPSContact({ agentId, contactFields, showContactForm, themeColor }) {
  const colors = getColors(themeColor);
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = contactFields?.filter((f) => f.enabled !== false) || [
    { name: "name", label: "Your Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "message", label: "Tell us about your dream trip...", type: "textarea" },
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (agentId) {
        const API_BASE_URL = process.env.REACT_APP_API_URL;
        await fetch(`${API_BASE_URL}/contact/${agentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, agentId }),
        });
      }
      setSubmitted(true);
    } catch { setSubmitted(true); }
    setLoading(false);
  };

  return (
    <section id="sps-contact" style={{ padding: "80px 24px", background: colors.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

          {/* Left: Info */}
          <div className="sps-reveal">
            <p style={{ color: colors.primary, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
              Get In Touch
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, color: colors.fg, margin: "0 0 16px" }}>
              Plan Your Dream Trip
            </h2>
            <p style={{ color: colors.mutedFg, marginBottom: 32, maxWidth: 420, lineHeight: 1.65, fontSize: 15 }}>
              Have questions? Our travel experts are here to help you create the perfect itinerary.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "📞", label: "+91 98765 43210" },
                { icon: "✉️", label: "hello@travplatforms.com" },
                { icon: "📍", label: "Mumbai, Maharashtra, India" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors.primary}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                    {icon}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: colors.fg }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="sps-reveal" style={{ background: colors.card, borderRadius: 20, border: `1px solid ${colors.border}`, padding: 32 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: colors.fg, margin: "0 0 24px" }}>
              Contact Form
            </h3>
            {!showContactForm ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: colors.mutedFg, fontSize: 13, border: `2px dashed ${colors.border}`, borderRadius: 12 }}>
                Contact form is hidden
              </div>
            ) : submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ fontWeight: 600, color: colors.fg, marginBottom: 4 }}>Inquiry Sent!</p>
                <p style={{ fontSize: 13, color: colors.mutedFg }}>We'll get back to you soon.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {fields.map((f) =>
                  f.type === "textarea" ? (
                    <div key={f.name}>
                      <label style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: colors.mutedFg, display: "block", marginBottom: 6 }}>
                        {f.label}
                      </label>
                      <textarea
                        rows={4}
                        placeholder={f.label}
                        className="sps-textarea"
                        value={form[f.name] || ""}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.muted, fontSize: 14, color: colors.fg, resize: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ) : (
                    <div key={f.name}>
                      <label style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: colors.mutedFg, display: "block", marginBottom: 6 }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type || "text"}
                        placeholder={f.label}
                        className="sps-input"
                        value={form[f.name] || ""}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.muted, fontSize: 14, color: colors.fg, boxSizing: "border-box" }}
                      />
                    </div>
                  )
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: colors.primary, color: "#fff", borderRadius: 10, padding: "14px 24px", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function SPSFooter({ branding, themeColor, extraPages = [], pageId }) {
  const colors = getColors(themeColor);
  const brandVal = branding?.value || "/logo3.png";
  const brandType = branding?.type || "logo";

  const PAGE_MAP = {
    about: "About Us",
    blog: "Blog",
    help: "Help Center",
    contact_page: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions"
  };

  const homeUrl = pageId ? `/view/${pageId}` : "/";

  const links = {
    Support: [
      { label: "Help Center", id: "help" },
      { label: "FAQs", id: "help" },
      { label: "Privacy Policy", id: "privacy" },
      { label: "Terms", id: "terms" }
    ],
    Destinations: [
      { label: "Goa", id: "packages" },
      { label: "Kerala", id: "packages" },
      { label: "Rajasthan", id: "packages" },
      { label: "Himachal", id: "packages" }
    ],
  };

  return (
    <footer style={{ background: colors.dark, color: "#e5e7eb", padding: "64px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Link to={homeUrl} style={{ width: 36, height: 36, borderRadius: 10, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.66A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </Link>
              {brandType === "logo" && branding?.value ? (
                <img src={branding.value} alt="Logo" style={{ height: 28, objectFit: "contain" }} />
              ) : (
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{brandVal}</span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              India's smartest travel platform. Curated packages, best prices, unforgettable memories.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, color: "#fff" }}>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li><Link to={homeUrl} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link></li>
              {extraPages.map((pId) => (
                <li key={pId}>
                  <Link to={`${homeUrl}?subPage=${pId}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                    {PAGE_MAP[pId] || pId}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, color: "#fff" }}>{title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <li key={item.label}>
                    {extraPages.includes(item.id) || item.id === "packages" ? (
                      <Link 
                        to={item.id === "packages" ? `${homeUrl}#sps-packages` : `${homeUrl}?subPage=${item.id}`} 
                        style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          © 2026 {brandVal}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Layout Config (for layout picker card) ───────────────────────────────────
export const layoutConfig = {
  id: "SinglePageStudio",
  name: "Single Page Studio",
  description: "Full-page scroll: Hero, Packages grid, Features, Calendar & Contact",
  thumbnail: "✨",
  previewBg: "linear-gradient(135deg, #FAFAF8 0%, #EEF2FF 100%)",
};

// ─── Layout Preview (shown in admin layout picker card) ───────────────────────
export function LayoutPreview({ themeColor }) {
  const colors = getColors(themeColor);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: colors.bg }}>
      {/* Navbar strip */}
      <div style={{ height: 28, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, background: "rgba(255,255,255,0.95)", borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: colors.primary, flexShrink: 0 }} />
        <div style={{ width: 48, height: 8, borderRadius: 4, background: colors.fg, opacity: 0.7 }} />
        <div style={{ flex: 1 }} />
        {[1, 2, 3].map((i) => <div key={i} style={{ width: 28, height: 6, borderRadius: 3, background: colors.mutedFg, opacity: 0.4, marginLeft: 8 }} />)}
        <div style={{ width: 36, height: 16, borderRadius: 6, background: colors.primary, opacity: 0.85, marginLeft: 8 }} />
      </div>
      {/* Hero */}
      <div style={{ flex: "0 0 80px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a1f3c, #2d4a8a)" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
        <div style={{ position: "relative", padding: "12px 12px 0", textAlign: "center" }}>
          <div style={{ width: 48, height: 4, borderRadius: 2, background: colors.sand, opacity: 0.7, margin: "0 auto 5px" }} />
          <div style={{ width: 80, height: 8, borderRadius: 3, background: "white", opacity: 0.85, margin: "0 auto 3px" }} />
          <div style={{ width: 56, height: 8, borderRadius: 3, background: colors.accent, opacity: 0.85, margin: "0 auto 8px" }} />
          {/* Search bar mini */}
          <div style={{ display: "flex", gap: 3, height: 14, background: "rgba(255,255,255,0.92)", borderRadius: 6, padding: 2, maxWidth: 120, margin: "0 auto" }}>
            {[1, 1, 1].map((_, i) => <div key={i} style={{ flex: 1, borderRadius: 4, background: colors.muted }} />)}
            <div style={{ width: 22, borderRadius: 4, background: colors.primary }} />
          </div>
        </div>
      </div>
      {/* Package cards row */}
      <div style={{ padding: "8px 10px", display: "flex", gap: 5, flexShrink: 0 }}>
        {[0.9, 0.7, 0.8].map((op, i) => (
          <div key={i} style={{ flex: 1, height: 44, borderRadius: 8, background: colors.card, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
            <div style={{ height: 22, background: `rgba(85,140,210,${op * 0.35})` }} />
            <div style={{ padding: "3px 5px" }}>
              <div style={{ width: "70%", height: 4, borderRadius: 2, background: colors.fg, opacity: 0.6, marginBottom: 2 }} />
              <div style={{ width: "40%", height: 3, borderRadius: 2, background: colors.primary, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>
      {/* Features row */}
      <div style={{ padding: "0 10px 8px", display: "flex", gap: 4, flexShrink: 0 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: 24, borderRadius: 6, background: colors.muted, border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary, opacity: 0.6 }} />
          </div>
        ))}
      </div>
      {/* Footer strip */}
      <div style={{ marginTop: "auto", height: 16, background: colors.dark, flexShrink: 0 }} />
    </div>
  );
}

// ─── Main Layout Export ───────────────────────────────────────────────────────
export default function SinglePageStudioLayout({ draftData, agentId, isAdmin, updateField, onPageClick }) {
  useEffect(() => { injectSPSCSS(); }, []);

  const [viewDate, setViewDate] = useState(new Date());

  const { 
    branding, themeColor, packages, countries, 
    contactFields, showContactForm, hero, sections,
    widgets = ["destinations", "packages", "flights", "hotels", "calendar", "contact"],
    hiddenWidgets = []
  } = draftData || {};

  const colors = getColors(themeColor);

  const handleUpdate = (section, field, value) => {
    if (section === "hero") {
      updateField("hero", { ...hero, [field]: value });
    } else if (section === "branding") {
      updateField("branding", { ...branding, value: value });
    } else {
      const newSections = { ...sections };
      newSections[section] = { ...newSections[section], [field]: value };
      updateField("sections", newSections);
    }
  };

  // Filter packages based on viewDate
  const currentMonthKey = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}`;
  const filteredPackages = (packages || []).filter(pkg => {
    const start = pkg.startMonth || pkg.month;
    const end = pkg.endMonth || start;
    if (!start) return true; // Show packages with no date specified
    return currentMonthKey >= start && currentMonthKey <= end;
  });

  return (
    <div className="sps-layout" style={{ overflowY: "auto", height: "100%", fontFamily: draftData?.fontFamily || "'DM Sans', sans-serif" }}>
      <SPSNavbar branding={branding} themeColor={themeColor} isAdmin={isAdmin} onUpdate={handleUpdate} extraPages={draftData?.extraPages} pageId={agentId} onPageClick={onPageClick} />
      <SPSHero themeColor={themeColor} data={hero} isAdmin={isAdmin} onUpdate={handleUpdate} />
      
      <div style={{ display: "flex", flexDirection: "column" }}>
        {widgets.map((widgetId) => {
          if (hiddenWidgets.includes(widgetId)) return null;

          if (widgetId === "destinations") {
            return <SPSFeatures key="destinations" themeColor={themeColor} data={sections?.features} isAdmin={isAdmin} onUpdate={handleUpdate} />;
          }
          if (widgetId === "packages") {
            return (
              <SPSPackages 
                key="packages"
                packages={filteredPackages} 
                themeColor={themeColor} 
                isAdmin={isAdmin}
                data={sections?.packages}
                onUpdate={handleUpdate}
              />
            );
          }
          if (widgetId === "flights") {
            return (
              <section key="flights" id="sps-flights" style={{ padding: "80px 24px", background: colors.muted }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                  <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <p style={{ color: colors.primary, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
                      <EditableText value={sections?.flights?.subtitle || "Sky High Deals"} isAdmin={isAdmin} onSave={(v) => handleUpdate("flights", "subtitle", v)} />
                    </p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: colors.fg, margin: 0 }}>
                      <EditableText value={sections?.flights?.title || "Exclusive Flights"} isAdmin={isAdmin} onSave={(v) => handleUpdate("flights", "title", v)} />
                    </h2>
                  </div>
                  <FlightSection themeColor={themeColor} />
                </div>
              </section>
            );
          }
          if (widgetId === "hotels") {
            return (
              <section key="hotels" id="sps-hotels" style={{ padding: "80px 24px", background: colors.bg }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                  <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <p style={{ color: colors.primary, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
                      <EditableText value={sections?.hotels?.subtitle || "Stay in Luxury"} isAdmin={isAdmin} onSave={(v) => handleUpdate("hotels", "subtitle", v)} />
                    </p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: colors.fg, margin: 0 }}>
                      <EditableText value={sections?.hotels?.title || "Handpicked Stays"} isAdmin={isAdmin} onSave={(v) => handleUpdate("hotels", "title", v)} />
                    </h2>
                  </div>
                  <HotelSection themeColor={themeColor} />
                </div>
              </section>
            );
          }
          if (widgetId === "calendar") {
            return (
              <section key="calendar" id="sps-calendar" style={{ padding: "80px 24px", background: colors.muted }}>
                <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                  <div className="sps-reveal" style={{ textAlign: "center", marginBottom: 48 }}>
                    <p style={{ color: themeColor || "#558cd2", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
                      <EditableText 
                        value={sections?.calendar?.subtitle || "Plan Smart"} 
                        isAdmin={isAdmin} 
                        onSave={(v) => handleUpdate("calendar", "subtitle", v)} 
                      />
                    </p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#1a1f3c", margin: 0 }}>
                      <EditableText 
                        value={sections?.calendar?.title || "Holiday Calendar"} 
                        isAdmin={isAdmin} 
                        onSave={(v) => handleUpdate("calendar", "title", v)} 
                      />
                    </h2>
                  </div>
                  <Calendar 
                    selectedCountries={countries} 
                    themeColor={themeColor} 
                    viewDate={viewDate}
                    setViewDate={setViewDate}
                    isAdmin={isAdmin}
                    calendarTheme={draftData?.calendarTheme}
                  />
                </div>
              </section>
            );
          }
          if (widgetId === "contact") {
            return (
              <SPSContact 
                key="contact"
                agentId={agentId} 
                contactFields={contactFields} 
                showContactForm={showContactForm !== false} 
                themeColor={themeColor} 
              />
            );
          }
          return null;
        })}
      </div>

      <SPSFooter branding={branding} themeColor={themeColor} extraPages={draftData?.extraPages} pageId={agentId} />
    </div>
  );
}