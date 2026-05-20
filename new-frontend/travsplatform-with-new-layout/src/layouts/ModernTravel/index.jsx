// src/layouts/ModernTravel/index.jsx
// "Modern Travel" layout — based on clean-ui-design project
// Hero section, destination grid, package cards, calendar, contact form, footer.
// Uses draftData from admin panel (branding, themeColor, packages, countries, contactFields, showContactForm)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchableSelect from "../../components/Common/SearchableSelect";
import { COUNTRY_OPTIONS, ALL_HOLIDAYS, MONTHS, DAYS } from "../../data/holidays";
import PackagesList from "../../components/Packages/PackagesList";
import Calendar from "../../components/Calendar/Calendar";
import FlightSection from "../../components/TravelServices/FlightSection";
import HotelSection from "../../components/TravelServices/HotelSection";
import EditableImage from "../../components/Common/EditableImage";

// ─── Editable Text Wrapper ────────────────────────────────────────────────────
function EditableText({ value, onSave, isAdmin, className, tag: Tag = "span", multiline = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => { setTempValue(value); }, [value]);

  if (!isAdmin) return <Tag className={className}>{value}</Tag>;

  if (isEditing) {
    const commonStyle = {
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      color: "inherit",
      background: "rgba(255,255,255,0.1)",
      border: "1px dashed rgba(255,255,255,0.3)",
      width: "100%",
      outline: "none",
      padding: "2px 4px",
      borderRadius: "4px",
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
      className={`${className} cursor-text hover:bg-white/10 transition-colors rounded`}
      onDoubleClick={() => setIsEditing(true)}
      title="Double click to edit"
    >
      {value}
    </Tag>
  );
}

// ─── CSS injected once ────────────────────────────────────────────────────────
const LAYOUT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
.mt-layout { font-family: 'Space Grotesk', sans-serif; }
.mt-layout h1,.mt-layout h2,.mt-layout h3,.mt-layout h4 { font-family: 'Playfair Display', serif; }

/* Stylish Marquee Animation */
@keyframes mt-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-mt-marquee {
  display: flex;
  flex-direction: row;
  width: max-content;
  animation: mt-marquee 40s linear infinite; 
}

.animate-mt-marquee:hover {
  animation-play-state: paused;
}

.marquee-container {
  position: relative;
  overflow: hidden;
  background: white;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 0;
}

/* Gradient shadow for professional look */
.marquee-container::before, .marquee-container::after {
  content: "";
  position: absolute;
  top: 0; width: 150px; height: 100%;
  z-index: 2;
  pointer-events: none;
}
.marquee-container::before {
  left: 0;
  background: linear-gradient(to right, white, transparent);
}
.marquee-container::after {
  right: 0;
  background: linear-gradient(to left, white, transparent);
}
`;

function injectCSS() {
  if (document.getElementById("mt-layout-css")) return;
  const s = document.createElement("style");
  s.id = "mt-layout-css";
  s.textContent = LAYOUT_CSS;
  document.head.appendChild(s);
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function MTNavbar({ branding, themeColor, isAdmin, onUpdate, extraPages = [], pageId, onPageClick }) {
  const brandVal = branding?.value || "/logo3.png";
  const brandType = branding?.type || "logo";
  const color = themeColor || "#E8960C";

  const PAGE_MAP = {
    about: "About",
    blog: "Blog",
    help: "Help",
    contact_page: "Contact",
    privacy: "Privacy",
    terms: "Terms"
  };

  const homeUrl = pageId ? `/view/${pageId}` : "/";

  // In admin mode, we want to prevent navigation and instead use onPageClick if provided
  const LinkComponent = isAdmin ? "button" : Link;
  const getProps = (to, subPageId = null) => {
    if (isAdmin) {
      return {
        onClick: (e) => {
          e.preventDefault();
          if (onPageClick) onPageClick(subPageId);
        }
      };
    }
    return { to };
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <LinkComponent {...getProps(homeUrl)} className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg" style={{ background: color }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </LinkComponent>
          {brandType === "logo" && brandVal ? (
            <LinkComponent {...getProps(homeUrl)}>
              <img src={brandVal} alt="Logo" className="h-8 w-auto object-contain" />
            </LinkComponent>
          ) : (
            <EditableText 
              value={brandVal} 
              isAdmin={isAdmin} 
              onSave={(v) => onUpdate("branding", "value", v)} 
              tag="span"
              className="text-lg font-bold tracking-tight text-white drop-shadow-md"
              style={{ fontFamily: "'Playfair Display', serif" }}
            />
          )}
        </div>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-2xl px-2 py-1.5 mt-glass-dark">
          {["Destinations", "Packages", "Flights", "Hotels", "Calendar", "Contact"].map((l) => (
            <LinkComponent key={l} {...getProps(`${homeUrl}#mt-${l.toLowerCase()}`)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
              style={{ background: "none", border: "none" }}
            >
              {l}
            </LinkComponent>
          ))}
          {/* Extra Pages Links */}
          {extraPages.map((pId) => (
            <LinkComponent 
              key={pId} 
              {...getProps(`${homeUrl}?subPage=${pId}`, pId)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all border-l border-white/10 ml-1 pl-5"
              style={{ background: "none", border: "none" }}
            >
              {PAGE_MAP[pId] || pId}
            </LinkComponent>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function MTHero({ themeColor, data, isAdmin, onUpdate }) {
  const color = themeColor || "#E8960C";
  const title = data?.title || "Discover Your Next Adventure";
  const subtitle = data?.subtitle || "Smart travel planning with holiday calendars, curated packages, and exclusive deals.";
  const heroImg = data?.image || "/assets/hero-bg.jpg";

  return (
    <section className="relative flex min-h-[56vh] items-center overflow-hidden">
      <div className="absolute inset-0 h-full w-full">
        <EditableImage 
          src={heroImg} 
          isAdmin={isAdmin} 
          onSave={(v) => onUpdate("hero", "image", v)}
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)" }} />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-20 pointer-events-auto">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: color }} />
          <span className="text-[10px] font-medium tracking-wider text-white/90 uppercase tracking-[0.2em]">
            <EditableText value={data?.badge || "Explore 500+ Destinations"} isAdmin={isAdmin} onSave={(v) => onUpdate("hero", "badge", v)} />
          </span>
        </div>

        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          <EditableText 
            value={title} 
            isAdmin={isAdmin} 
            onSave={(val) => onUpdate("hero", "title", val)}
            tag="span"
          />
        </h1>
        <p className="mt-3 max-w-lg text-sm text-white/70 leading-relaxed">
          <EditableText 
            value={subtitle} 
            isAdmin={isAdmin} 
            onSave={(val) => onUpdate("hero", "subtitle", val)}
            tag="span"
            multiline
          />
        </p>

        {/* Stats */}
        <div className="mt-6 flex gap-8 pb-6">
          {[{ v: "500+", l: "Destinations" }, { v: "10K+", l: "Travelers" }, { v: "4.9", l: "Rating" }].map((s) => (
            <div key={s.l}>
              <div className="text-xl font-bold text-white">{s.v}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Marquee Row ──────────────────────────────────────────────────────────────
function MTMarquee({ themeColor, data, isAdmin, onUpdate }) {
  const color = themeColor || "#E8960C";

  const defaultOffers = [
    { emoji: "🔥", text: "Exclusive Season Deal — FLAT 50% OFF" },
    { emoji: "✨", text: "Premium Travel Experience — Save 50% Today" },
    { emoji: "🌟", text: "Limited Time Offer — Professional Packages @ 50% Discount" },
  ];

  const offers = data?.items || defaultOffers;
  const items = [...offers, ...offers];

  const handleUpdateOffer = (idx, field, val) => {
    const newItems = [...offers];
    newItems[idx] = { ...newItems[idx], [field]: val };
    onUpdate("marquee", "items", newItems);
  };

  const scrollToCalendar = () => {
    const el = document.getElementById("mt-calendar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${color}08, ${color}15)`,
      borderTop: `1px solid ${color}25`,
      borderBottom: `1px solid ${color}25`,
      padding: "0",
    }}>
      {/* Left fade */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: `linear-gradient(to right, white, transparent)`,
        pointerEvents: "none",
      }} />
      {/* Right fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: `linear-gradient(to left, white, transparent)`,
        pointerEvents: "none",
      }} />

      {/* Scrolling track */}
      <div style={{
        display: "flex",
        width: "max-content",
        animation: "mt-marquee-scroll 35s linear infinite",
        padding: "12px 0",
      }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
      >
        {items.map((offer, i) => {
          const originalIdx = i % offers.length;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {/* Offer pill */}
              <div 
                style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "white",
                border: `1px solid ${color}30`,
                borderRadius: 999,
                padding: "6px 16px",
                marginRight: 12,
                boxShadow: `0 1px 6px ${color}15`,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 15 }}>
                  <EditableText value={offer.emoji} isAdmin={isAdmin} onSave={(v) => handleUpdateOffer(originalIdx, "emoji", v)} />
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                  <EditableText value={offer.text} isAdmin={isAdmin} onSave={(v) => handleUpdateOffer(originalIdx, "text", v)} />
                </span>
                <span 
                  onClick={scrollToCalendar}
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "white",
                    background: color,
                    borderRadius: 999,
                    padding: "2px 10px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                  view calendar
                </span>
              </div>

              {/* Divider dot */}
              <span style={{
                width: 5, height: 5,
                borderRadius: "50%",
                background: `${color}50`,
                marginRight: 12,
                flexShrink: 0,
              }} />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes mt-marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Destination Grid ─────────────────────────────────────────────────────────
function MTDestinations({ themeColor, data, isAdmin, onUpdate }) {
  const color = themeColor || "#E8960C";
  const title = data?.title || "Trending Destinations";
  const badge = data?.subtitle || "Explore";

  const defaultDestinations = [
    { title: "Mountain Retreats", subtitle: "Himalayas & Beyond", img: "/assets/dest-mountains.jpg", trips: "120+ trips" },
    { title: "Coastal Paradise", subtitle: "Beaches & Islands", img: "/assets/dest-beach.jpg", trips: "200+ trips" },
    { title: "Cultural Heritage", subtitle: "Temples & History", img: "/assets/dest-culture.jpg", trips: "85+ trips" },
    { title: "Tropical Escapes", subtitle: "Goa & Kerala", img: "/assets/gokarna.jpg", trips: "150+ trips" },
  ];

  const destinations = data?.items || defaultDestinations;

  const handleUpdateItem = (idx, field, val) => {
    const next = [...destinations];
    next[idx] = { ...next[idx], [field]: val };
    onUpdate("destinations", "items", next);
  };

  return (
    <section id="mt-destinations" className="py-14" style={{ background: "#f8fafc" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
              <EditableText value={badge} isAdmin={isAdmin} onSave={(v) => onUpdate("destinations", "subtitle", v)} />
            </span>
            <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
              <EditableText value={title} isAdmin={isAdmin} onSave={(v) => onUpdate("destinations", "title", v)} />
            </h2>
          </div>
          <a href="#" className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color }}>
            View all →
          </a>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ gridAutoRows: "200px" }}>
          {destinations.map((d, i) => (
            <div key={i} className={`mt-dest-card group relative overflow-hidden rounded-xl cursor-pointer ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
              <EditableImage 
                src={d.img} 
                isAdmin={isAdmin} 
                onSave={(v) => handleUpdateItem(i, "img", v)}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-auto">
                <span className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                  <EditableText value={d.trips} isAdmin={isAdmin} onSave={(v) => handleUpdateItem(i, "trips", v)} />
                </span>
                <h3 className="text-base font-bold text-white">
                  <EditableText value={d.title} isAdmin={isAdmin} onSave={(v) => handleUpdateItem(i, "title", v)} />
                </h3>
                <p className="text-xs text-white/60">
                  <EditableText value={d.subtitle} isAdmin={isAdmin} onSave={(v) => handleUpdateItem(i, "subtitle", v)} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Package Cards ────────────────────────────────────────────────────────────
function MTPackages({ packages, themeColor, data, isAdmin, onUpdate }) {
  const color = themeColor || "#E8960C";
  const title = data?.title || "Smart Package Picks";
  const badge = data?.subtitle || "Curated For You";

  return (
    <section id="mt-packages" className="py-14" style={{ background: "#f8fafc" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
            <EditableText value={badge} isAdmin={isAdmin} onSave={(v) => onUpdate("packages", "subtitle", v)} />
          </span>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            <EditableText value={title} isAdmin={isAdmin} onSave={(v) => onUpdate("packages", "title", v)} />
          </h2>
        </div>

        <PackagesList packages={packages} isAdmin={isAdmin} />
      </div>
    </section>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function MTContact({ agentId, contactFields, themeColor }) {
  const color = themeColor || "#E8960C";
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = contactFields?.filter((f) => f.enabled !== false) || [
    { name: "name", label: "Your Name", type: "text" },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "message", label: "Tell us about your dream trip...", type: "textarea" },
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      if (agentId) {
        const API_BASE = process.env.REACT_APP_API_URL;
        await fetch(`${API_BASE}/contact/${agentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, agentId }),
        });
      }
      setSubmitted(true);
    } catch (e) { setSubmitted(true); }
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        Get in <span className="mt-text-gradient" style={{ color }}>Touch</span>
      </h3>
      {submitted ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-semibold text-gray-700">Inquiry Sent!</p>
          <p className="text-xs text-gray-400 mt-1">We'll get back to you soon.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.filter((f) => ["name", "phone"].includes(f.name)).map((f) => (
              <input key={f.name} type={f.type || "text"} placeholder={f.label}
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="rounded-lg border-0 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 w-full"
                style={{ focusRingColor: color }} />
            ))}
          </div>
          {fields.filter((f) => !["name", "phone"].includes(f.name)).map((f) => (
            f.type === "textarea" ? (
              <textarea key={f.name} rows={3} placeholder={f.label}
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="rounded-lg border-0 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 w-full resize-none" />
            ) : (
              <input key={f.name} type={f.type || "text"} placeholder={f.label}
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="rounded-lg border-0 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 w-full" />
            )
          ))}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: color }}>
            {loading ? "Sending..." : (<>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit Inquiry
            </>)}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function MTFooter({ branding, themeColor, isAdmin, onUpdate, data, extraPages = [], pageId }) {
  const color = themeColor || "#E8960C";
  const brandVal = branding?.value || "/logo3.png";
  const brandType = branding?.type || "logo";
  const footerDesc = data?.description || "Smart travel planning with holiday calendars, curated packages, and exclusive deals.";

  const PAGE_MAP = {
    about: "About Us",
    blog: "Blog",
    help: "Help Center",
    contact_page: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions"
  };

  const homeUrl = pageId ? `/view/${pageId}` : "/";

  return (
    <footer style={{ background: "#1a1f2e", color: "#e5e7eb" }}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Link to={homeUrl} className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: color }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </Link>
              {brandType === "logo" && branding?.value ? (
                <EditableImage 
                  src={branding.value} 
                  isAdmin={isAdmin} 
                  onSave={(v) => onUpdate("branding", "value", v)}
                  style={{ height: 28 }}
                />
              ) : (
                <span className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <EditableText value={brandVal} isAdmin={isAdmin} onSave={(v) => onUpdate("branding", "value", v)} />
                </span>
              )}
            </div>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              <EditableText value={footerDesc} isAdmin={isAdmin} onSave={(v) => onUpdate("footer", "description", v)} multiline />
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Company</h4>
            <ul className="space-y-2.5">
              {["About Us", "Careers", "Blog", "Press"].map((l) => (
                <li key={l}>
                  <Link to={`${homeUrl}#mt-destinations`} className="text-sm text-gray-400 hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
              {/* Dynamic Extra Pages */}
              {extraPages.map((pId) => (
                <li key={pId}>
                  <Link to={`${homeUrl}?subPage=${pId}`} className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium">
                    {PAGE_MAP[pId] || pId}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {[
            { 
              heading: "Support", 
              links: [
                { label: "Help Center", id: "help" },
                { label: "Contact", id: "contact_page" },
                { label: "Privacy", id: "privacy" },
                { label: "Terms", id: "terms" }
              ] 
            },
            { 
              heading: "Destinations", 
              links: [
                { label: "India", id: "destinations" },
                { label: "Southeast Asia", id: "destinations" },
                { label: "Europe", id: "destinations" },
                { label: "Maldives", id: "destinations" }
              ] 
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {extraPages.includes(l.id) || l.id === "destinations" ? (
                      <Link 
                        to={l.id === "destinations" ? `${homeUrl}#mt-destinations` : `${homeUrl}?subPage=${l.id}`} 
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-600 cursor-not-allowed">{l.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-6 text-center text-xs text-gray-600" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          © 2026 <EditableText value={brandVal} isAdmin={isAdmin} onSave={(v) => onUpdate("branding", "value", v)} />. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Main Layout Export ───────────────────────────────────────────────────────
export const layoutConfig = {
  id: "ModernTravel",
  name: "Modern Travel",
  description: "Hero section, destination grid, packages, calendar & footer",
  thumbnail: "🌍",
  previewBg: "linear-gradient(135deg, #1a1f2e 0%, #16213e 50%, #0f3460 100%)",
};

export function LayoutPreview({ themeColor }) {
  const color = themeColor || "#E8960C";
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: layoutConfig.previewBg }}>
      <div className="h-8 flex items-center px-4 gap-2 shrink-0" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div className="w-3 h-3 rounded-lg" style={{ background: color }} />
        <div className="w-16 h-1.5 rounded-full bg-white opacity-80" />
      </div>
      <div className="px-4 pt-4 pb-2">
        <div className="w-20 h-1.5 rounded-full mb-2" style={{ background: color, opacity: 0.7 }} />
        <div className="w-36 h-3 rounded-full bg-white opacity-70 mb-1" />
      </div>
      <div className="px-4 py-2 flex gap-1.5">
        <div className="flex-[2] h-16 rounded-lg bg-white opacity-20" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex-1 rounded-lg bg-white opacity-15" />
          <div className="flex-1 rounded-lg bg-white opacity-15" />
        </div>
      </div>
    </div>
  );
}

export default function ModernTravelLayout({ draftData, agentId, isAdmin, updateField }) {
  useEffect(() => { injectCSS(); }, []);

  const [viewDate, setViewDate] = useState(new Date());
  const { 
    branding, themeColor, packages, countries, 
    contactFields, showContactForm, hero, sections,
    widgets = ["destinations", "packages", "flights", "hotels", "calendar", "contact"],
    hiddenWidgets = []
  } = draftData || {};

  // Track visit country from calendar to filter packages
  const [visitCountry, setVisitCountry] = useState(countries?.[1] || countries?.[0] || "india");

  const handleUpdate = (section, field, value) => {
    if (section === "hero") {
      updateField("hero", { ...hero, [field]: value });
    } else if (section === "branding") {
      updateField("branding", { ...branding, [field]: value });
    } else {
      const newSections = { ...sections };
      newSections[section] = { ...newSections[section], [field]: value };
      updateField("sections", newSections);
    }
  };

  const currentMonthKey = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}`;
  
  // Filter by month
  const monthFilteredPackages = (packages || []).filter(pkg => {
    const start = pkg.startMonth || pkg.month;
    const end = pkg.endMonth || start;
    if (!start) return true;
    return currentMonthKey >= start && currentMonthKey <= end;
  });

  return (
    <div className="mt-layout overflow-y-auto h-full" style={{ background: "#f8fafc", fontFamily: draftData?.fontFamily || "'Space Grotesk', sans-serif" }}>
      <div className="relative">
        <MTNavbar branding={branding} themeColor={themeColor} isAdmin={isAdmin} onUpdate={handleUpdate} extraPages={draftData?.extraPages} pageId={agentId} />
        <MTHero themeColor={themeColor} data={hero} isAdmin={isAdmin} onUpdate={handleUpdate} />
      </div>
      <MTMarquee themeColor={themeColor} data={sections?.marquee} isAdmin={isAdmin} onUpdate={handleUpdate} />
      
      <div className="flex flex-col">
        {widgets.map((widgetId) => {
          // Skip if hidden
          if (hiddenWidgets.includes(widgetId)) return null;

          if (widgetId === "destinations") {
            return (
              <MTDestinations 
                key="destinations"
                themeColor={themeColor} 
                data={sections?.destinations} 
                isAdmin={isAdmin} 
                onUpdate={handleUpdate} 
              />
            );
          }
          if (widgetId === "packages") {
            return (
              <MTPackages 
                key="packages"
                packages={monthFilteredPackages} 
                isAdmin={isAdmin} 
                visitCountry={visitCountry}
                data={sections?.packages}
                onUpdate={handleUpdate}
              />
            );
          }
          if (widgetId === "flights") {
            return (
              <section key="flights" id="mt-flights" className="py-14 bg-gray-50">
                <div className="mx-auto max-w-5xl px-6">
                  <div className="mb-8 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: themeColor || "#E8960C" }}>
                      <EditableText value={sections?.flights?.subtitle || "Sky High Deals"} isAdmin={isAdmin} onSave={(v) => handleUpdate("flights", "subtitle", v)} />
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                      <EditableText value={sections?.flights?.title || "Exclusive Flights"} isAdmin={isAdmin} onSave={(v) => handleUpdate("flights", "title", v)} />
                    </h2>
                  </div>
                  <FlightSection themeColor={themeColor} margin={draftData?.flightMargin} />
                </div>
              </section>
            );
          }
          if (widgetId === "hotels") {
            return (
              <section key="hotels" id="mt-hotels" className="py-14 bg-white">
                <div className="mx-auto max-w-5xl px-6">
                  <div className="mb-8 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: themeColor || "#E8960C" }}>
                      <EditableText value={sections?.hotels?.subtitle || "Stay in Luxury"} isAdmin={isAdmin} onSave={(v) => handleUpdate("hotels", "subtitle", v)} />
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                      <EditableText value={sections?.hotels?.title || "Handpicked Stays"} isAdmin={isAdmin} onSave={(v) => handleUpdate("hotels", "title", v)} />
                    </h2>
                  </div>
                  <HotelSection themeColor={themeColor} margin={draftData?.hotelMargin} />
                </div>
              </section>
            );
          }
          if (widgetId === "calendar") {
            return (
              <section key="calendar" id="mt-calendar" className="py-14" style={{ background: "#f8fafc" }}>
                <div className="mx-auto max-w-7xl px-6">
                  <div className="mb-8 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: themeColor || "#E8960C" }}>
                      <EditableText value={sections?.calendar?.subtitle || "Plan Smart"} isAdmin={isAdmin} onSave={(val) => handleUpdate("calendar", "subtitle", val)} />
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                      <EditableText value={sections?.calendar?.title || "Holiday Calendar"} isAdmin={isAdmin} onSave={(val) => handleUpdate("calendar", "title", val)} />
                    </h2>
                  </div>
                  <Calendar 
                    selectedCountries={countries} 
                    isAdmin={isAdmin} 
                    viewDate={viewDate} 
                    setViewDate={setViewDate} 
                    visitCountry={visitCountry}
                    setVisitCountry={setVisitCountry}
                    calendarTheme={draftData?.calendarTheme}
                  />
                </div>
              </section>
            );
          }
          if (widgetId === "contact") {
            return (
              <section key="contact" id="mt-contact" className="py-14 bg-white">
                <div className="mx-auto max-w-2xl px-6 text-center">
                  <div className="mb-8">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                       <EditableText value={sections?.contact?.subtitle || "Reach Out"} isAdmin={isAdmin} onSave={(v) => handleUpdate("contact", "subtitle", v)} />
                     </p>
                     <h2 className="text-3xl font-bold text-gray-900">
                       <EditableText value={sections?.contact?.title || "Contact Us"} isAdmin={isAdmin} onSave={(v) => handleUpdate("contact", "title", v)} />
                     </h2>
                  </div>
                  {showContactForm !== false ? (
                    <MTContact agentId={agentId} contactFields={contactFields} themeColor={themeColor} />
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 flex items-center justify-center p-8 text-center">
                      <p className="text-sm text-gray-400">Contact form is hidden</p>
                    </div>
                  )}
                </div>
              </section>
            );
          }
          return null;
        })}
      </div>

      <MTFooter 
        branding={branding} 
        themeColor={themeColor} 
        isAdmin={isAdmin} 
        onUpdate={handleUpdate} 
        data={sections?.footer}
        extraPages={draftData?.extraPages} 
        pageId={agentId}
      />
    </div>
  );
}
