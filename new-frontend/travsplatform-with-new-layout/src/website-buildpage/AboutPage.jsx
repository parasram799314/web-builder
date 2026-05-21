// src/website-buildpage/AboutPage.jsx
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import EditableText from "../components/Common/EditableText";
import { usePageContext } from "../context/PageContext";

const TRAVEL_IMAGES = {
  hero: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
  mission: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  vision: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  mosaic1: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80",
  mosaic2: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
  mosaic3: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80",
  mosaic4: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  team1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  team2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
  team3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  .ab-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ab-root { font-family: 'Space Grotesk', sans-serif; background: #f8fafc; }
  .ab-root h1,.ab-root h2,.ab-root h3,.ab-root h4 { font-family: 'Playfair Display', serif; }

  @keyframes ab-fadein { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ab-scale { from { transform:scale(1.08); } to { transform:scale(1); } }

  .ab-hero-img { animation: ab-scale 8s ease-out forwards; }
  .ab-hero-content > * { animation: ab-fadein 0.7s ease both; }
  .ab-hero-content > *:nth-child(1) { animation-delay: 0.1s; }
  .ab-hero-content > *:nth-child(2) { animation-delay: 0.25s; }
  .ab-hero-content > *:nth-child(3) { animation-delay: 0.4s; }
  .ab-hero-content > *:nth-child(4) { animation-delay: 0.55s; }

  .ab-stat-card { transition: transform 0.25s, box-shadow 0.25s; }
  .ab-stat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(232,150,12,0.15) !important; }

  .ab-mv-card { overflow: hidden; border-radius: 20px; position: relative; }
  .ab-mv-card img { transition: transform 0.5s ease; }
  .ab-mv-card:hover img { transform: scale(1.06); }

  .ab-mosaic-item { overflow: hidden; border-radius: 16px; position: relative; }
  .ab-mosaic-item img { transition: transform 0.5s ease; width: 100%; height: 100%; object-fit: cover; display: block; }
  .ab-mosaic-item:hover img { transform: scale(1.08); }
  .ab-mosaic-item::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ab-mosaic-item:hover::after { opacity: 1; }

  .ab-value-card { transition: transform 0.25s, box-shadow 0.25s; }
  .ab-value-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.08) !important; }
  .ab-value-icon { transition: transform 0.3s; }
  .ab-value-card:hover .ab-value-icon { transform: scale(1.15) rotate(-5deg); }

  .ab-team-card { transition: transform 0.25s; }
  .ab-team-card:hover { transform: translateY(-6px); }
  .ab-team-img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }

  .ab-timeline-dot { transition: transform 0.2s; }
  .ab-timeline-item:hover .ab-timeline-dot { transform: scale(1.3); }

  .ab-btn-primary { transition: transform 0.2s, box-shadow 0.2s; }
  .ab-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,150,12,0.4); }
  .ab-btn-secondary { transition: background 0.2s; }
  .ab-btn-secondary:hover { background: rgba(255,255,255,0.18) !important; }
`;

export default function AboutPage({ pageData, pageId, isAdmin, onPageClick }) {
  const { updateSubpageField } = usePageContext();
  const themeColor = pageData?.themeColor || "#E8960C";
  const brandVal = pageData?.branding?.value || "travsplatform";

  const content = pageData?.subpageContents?.about || {
    heroBadge: "Our Story",
    heroTitle: "Crafting Journeys, Creating Memories",
    heroSubtitle: "Since 2018, we've been redefining travel — turning ordinary trips into extraordinary adventures for thousands of travelers worldwide.",
    missionBadge: "Our Mission",
    missionTitle: "Seamless. Personal. Unforgettable.",
    missionDesc: "To provide seamless, personalized, and unforgettable travel experiences that connect people with cultures, landscapes, and communities around the world.",
    visionBadge: "Our Vision",
    visionTitle: "The World's Most Trusted Platform",
    visionDesc: "To become the world's most trusted platform for intelligent travel planning — where every journey is shaped by data, care, and human connection.",
    mosaicBadge: "Where We've Been",
    mosaicTitle: "The World Through Our Lens",
    valuesBadge: "What Drives Us",
    valuesTitle: "Our Core Values",
    journeyBadge: "How We Got Here",
    journeyTitle: "Our Journey",
    teamBadge: "The People",
    teamTitle: "Meet the Team",
    ctaBadge: "Ready to Explore?",
    ctaTitle: "Your Next Adventure Awaits",
    ctaDesc: "Browse 500+ destinations, smart packages, and let us plan the perfect trip tailored just for you.",
  };

  const handleSave = (field, val) => {
    updateSubpageField("about", field, val);
  };

  return (
    <div className="bg-white min-h-screen">
      <style>{ABOUT_CSS}</style>

      {/* ── Navbar ── */}
      <Navbar 
        branding={pageData?.branding} 
        themeColor={themeColor} 
        extraPages={pageData?.extraPages} 
        pageId={pageId} 
        isAdmin={isAdmin}
        onPageClick={onPageClick}
      />

      {/* ── Hero ── */}

      <section style={{ position: "relative", height: 480, overflow: "hidden" }}>
        <img className="ab-hero-img" src={TRAVEL_IMAGES.hero} alt="Travel hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,20,40,0.82) 0%, rgba(15,20,40,0.55) 50%, rgba(15,20,40,0.7) 100%)" }} />
        {/* decorative rings */}
        <div style={{ position: "absolute", right: -60, top: -60, width: 320, height: 320, borderRadius: "50%", border: `1px solid rgba(232,150,12,0.2)` }} />
        <div style={{ position: "absolute", right: 50, top: 50, width: 180, height: 180, borderRadius: "50%", border: `1px solid rgba(232,150,12,0.12)` }} />

        <div className="ab-hero-content" style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 20, backdropFilter: "blur(12px)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: themeColor }} />
              <EditableText
                value={content.heroBadge}
                onSave={(val) => handleSave("heroBadge", val)}
                isAdmin={isAdmin}
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.85)", textTransform: "uppercase" }}
              />
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1.1, maxWidth: 580 }}>
              <EditableText
                value={content.heroTitle}
                onSave={(val) => handleSave("heroTitle", val)}
                isAdmin={isAdmin}
                multiline
              />
            </h1>
            <p style={{ marginTop: 16, fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 480, lineHeight: 1.75 }}>
              <EditableText
                value={content.heroSubtitle}
                onSave={(val) => handleSave("heroSubtitle", val)}
                isAdmin={isAdmin}
                multiline
              />
            </p>
            <div style={{ marginTop: 28, display: "flex", gap: 28 }}>
              {[{ v: "500+", l: "Destinations" }, { v: "10K+", l: "Travelers" }, { v: "4.9★", l: "Rating" }].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "white", fontFamily: "'Playfair Display',serif" }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ── */}
      <div style={{ maxWidth: 1100, margin: "-44px auto 0", padding: "0 32px", position: "relative", zIndex: 5 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {[{ v: "500+", l: "Destinations" }, { v: "10K+", l: "Happy Travelers" }, { v: "4.9", l: "Avg. Rating" }, { v: "8 yrs", l: "Of Excellence" }].map(s => (
            <div key={s.l} className="ab-stat-card" style={{ background: "white", borderRadius: 16, padding: "22px 24px", border: "1px solid #f1f5f9", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: themeColor, fontFamily: "'Playfair Display',serif" }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission & Vision with images ── */}
      <section style={{ maxWidth: 1100, margin: "64px auto 0", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Mission */}
          <div className="ab-mv-card" style={{ border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
              <img src={TRAVEL_IMAGES.mission} alt="Mission" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.95) 100%)" }} />
            </div>
            <div style={{ background: "white", padding: "24px 28px 28px", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: themeColor, borderRadius: "0 0 0 0" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: themeColor, textTransform: "uppercase" }}>
                <EditableText
                  value={content.missionBadge}
                  onSave={(val) => handleSave("missionBadge", val)}
                  isAdmin={isAdmin}
                />
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "8px 0 12px" }}>
                <EditableText
                  value={content.missionTitle}
                  onSave={(val) => handleSave("missionTitle", val)}
                  isAdmin={isAdmin}
                />
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.75 }}>
                <EditableText
                  value={content.missionDesc}
                  onSave={(val) => handleSave("missionDesc", val)}
                  isAdmin={isAdmin}
                  multiline
                />
              </p>
            </div>
          </div>
          {/* Vision */}
          <div className="ab-mv-card" style={{ background: "#1a1f2e", border: "1px solid #252b3b" }}>
            <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
              <img src={TRAVEL_IMAGES.vision} alt="Vision" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(26,31,46,0.98) 100%)" }} />
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: themeColor, textTransform: "uppercase" }}>
                <EditableText
                  value={content.visionBadge}
                  onSave={(val) => handleSave("visionBadge", val)}
                  isAdmin={isAdmin}
                />
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", margin: "8px 0 12px" }}>
                <EditableText
                  value={content.visionTitle}
                  onSave={(val) => handleSave("visionTitle", val)}
                  isAdmin={isAdmin}
                />
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
                <EditableText
                  value={content.visionDesc}
                  onSave={(val) => handleSave("visionDesc", val)}
                  isAdmin={isAdmin}
                  multiline
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Travel Photo Mosaic ── */}
      <section style={{ maxWidth: 1100, margin: "64px auto 0", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: themeColor, textTransform: "uppercase" }}>
            <EditableText
              value={content.mosaicBadge}
              onSave={(val) => handleSave("mosaicBadge", val)}
              isAdmin={isAdmin}
            />
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#111827", marginTop: 8 }}>
            <EditableText
              value={content.mosaicTitle}
              onSave={(val) => handleSave("mosaicTitle", val)}
              isAdmin={isAdmin}
            />
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gridTemplateRows: "200px 200px", gap: 12 }}>
          <div className="ab-mosaic-item" style={{ gridRow: "1 / 3" }}>
            <img src={TRAVEL_IMAGES.mosaic1} alt="Travel 1" />
            <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 2, opacity: 0, transition: "opacity 0.3s" }} className="ab-mosaic-label">
              <span style={{ background: "rgba(0,0,0,0.6)", color: "white", fontSize: 12, padding: "4px 12px", borderRadius: 999, backdropFilter: "blur(8px)" }}>Europe</span>
            </div>
          </div>
          <div className="ab-mosaic-item">
            <img src={TRAVEL_IMAGES.mosaic2} alt="Travel 2" />
          </div>
          <div className="ab-mosaic-item">
            <img src={TRAVEL_IMAGES.mosaic3} alt="Travel 3" />
          </div>
          <div className="ab-mosaic-item" style={{ gridColumn: "2 / 4" }}>
            <img src={TRAVEL_IMAGES.mosaic4} alt="Travel 4" />
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section style={{ maxWidth: 1100, margin: "64px auto 0", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: themeColor, textTransform: "uppercase" }}>
            <EditableText
              value={content.valuesBadge}
              onSave={(val) => handleSave("valuesBadge", val)}
              isAdmin={isAdmin}
            />
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#111827", marginTop: 8 }}>
            <EditableText
              value={content.valuesTitle}
              onSave={(val) => handleSave("valuesTitle", val)}
              isAdmin={isAdmin}
            />
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, title: "Traveler First", desc: "Every decision we make starts with your experience, comfort, and delight." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "Smart Planning", desc: "We blend data, local expertise, and technology to plan trips that truly fit you." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: "Local Roots", desc: "Our on-ground partnerships ensure authentic, sustainable travel at every destination." },
          ].map(v => (
            <div key={v.title} className="ab-value-card" style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #f1f5f9", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="ab-value-icon" style={{ width: 52, height: 52, borderRadius: 14, background: "#FFF4E0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{v.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{v.title}</h4>
              <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.65 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ maxWidth: 1100, margin: "64px auto 0", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: themeColor, textTransform: "uppercase" }}>
            <EditableText
              value={content.journeyBadge}
              onSave={(val) => handleSave("journeyBadge", val)}
              isAdmin={isAdmin}
            />
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#111827", marginTop: 8 }}>
            <EditableText
              value={content.journeyTitle}
              onSave={(val) => handleSave("journeyTitle", val)}
              isAdmin={isAdmin}
            />
          </h2>
        </div>
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: `linear-gradient(to bottom, ${themeColor}, rgba(232,150,12,0.08))`, borderRadius: 2 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { year: "2018", title: "Founded in Indore", desc: "Started with a small team of passionate travelers and a bold idea: make travel planning intelligent and human.", dark: false },
              { year: "2020", title: "Launched Holiday Calendar", desc: "Introduced our signature smart holiday planner that became a go-to tool for thousands of Indian travelers.", dark: false },
              { year: "2023", title: "10,000 Travelers Milestone", desc: "Crossed 10K happy travelers with a 4.9 star average rating across all packages and destinations.", dark: false },
              { year: "2026 — Now", title: "Expanding Globally", desc: "500+ destinations, AI-powered planning, and a growing community of explorers across India and beyond.", dark: true },
            ].map(t => (
              <div key={t.year} className="ab-timeline-item" style={{ position: "relative", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div className="ab-timeline-dot" style={{ position: "absolute", left: -28, top: 6, width: 14, height: 14, borderRadius: "50%", background: themeColor, border: "3px solid white", boxShadow: `0 0 0 2px ${themeColor}`, flexShrink: 0 }} />
                <div style={{ background: t.dark ? "#1a1f2e" : "white", borderRadius: 14, padding: "20px 24px", border: t.dark ? "1px solid #252b3b" : "1px solid #f1f5f9", flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: themeColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.year}</span>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: t.dark ? "white" : "#111827", margin: "6px 0 8px" }}>{t.title}</h4>
                  <p style={{ fontSize: 13, color: t.dark ? "rgba(255,255,255,0.45)" : "#9ca3af", lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ maxWidth: 1100, margin: "64px auto 0", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: themeColor, textTransform: "uppercase" }}>
            <EditableText
              value={content.teamBadge}
              onSave={(val) => handleSave("teamBadge", val)}
              isAdmin={isAdmin}
            />
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: "#111827", marginTop: 8 }}>
            <EditableText
              value={content.teamTitle}
              onSave={(val) => handleSave("teamTitle", val)}
              isAdmin={isAdmin}
            />
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { img: TRAVEL_IMAGES.team1, name: "Aryan Mehta", role: "Founder & CEO", desc: "10 years in travel tech. Passionate about using data to create deeply personal journeys." },
            { img: TRAVEL_IMAGES.team2, name: "Priya Sharma", role: "Head of Experiences", desc: "Curated 200+ itineraries. Knows every hidden gem from Ladakh to Lakshadweep." },
            { img: TRAVEL_IMAGES.team3, name: "Rahul Joshi", role: "Tech Lead", desc: "Builds the smart tools that make travel planning feel effortless and intuitive." },
          ].map(m => (
            <div key={m.name} className="ab-team-card" style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #f1f5f9", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <img src={m.img} alt={m.name} className="ab-team-img" style={{ margin: "0 auto 14px" }} />
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{m.name}</h4>
              <p style={{ fontSize: 12, color: themeColor, fontWeight: 600, margin: "4px 0 10px" }}>{m.role}</p>
              <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1100, margin: "64px auto", padding: "0 32px" }}>
        <div style={{ background: "linear-gradient(135deg,#1a1f2e 0%,#0f3460 100%)", borderRadius: 24, padding: 56, textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* bg image overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${TRAVEL_IMAGES.mosaic2})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }} />
          <div style={{ position: "absolute", right: -40, bottom: -40, width: 220, height: 220, borderRadius: "50%", border: `1px solid rgba(232,150,12,0.2)` }} />
          <div style={{ position: "absolute", right: 50, bottom: 50, width: 110, height: 110, borderRadius: "50%", border: `1px solid rgba(232,150,12,0.12)` }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: themeColor, textTransform: "uppercase" }}>
              <EditableText
                value={content.ctaBadge}
                onSave={(val) => handleSave("ctaBadge", val)}
                isAdmin={isAdmin}
              />
            </span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: "white", margin: "12px 0 16px" }}>
              <EditableText
                value={content.ctaTitle}
                onSave={(val) => handleSave("ctaTitle", val)}
                isAdmin={isAdmin}
              />
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.7 }}>
              <EditableText
                value={content.ctaDesc}
                onSave={(val) => handleSave("ctaDesc", val)}
                isAdmin={isAdmin}
                multiline
              />
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href="#" className="ab-btn-primary" style={{ padding: "14px 28px", borderRadius: 12, background: themeColor, color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Explore Packages</a>
              <a href="#" className="ab-btn-secondary" style={{ padding: "14px 28px", borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block", border: "1px solid rgba(255,255,255,0.15)" }}>Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#1a1f2e", padding: "40px 32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: themeColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "white" }}>{brandVal}</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>© 2026 {brandVal}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}