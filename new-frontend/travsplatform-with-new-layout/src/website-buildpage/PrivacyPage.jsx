// src/website-buildpage/PrivacyPage.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import EditableText from "../components/Common/EditableText";
import { usePageContext } from "../context/PageContext";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  .pp-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .pp-root { font-family: 'Space Grotesk', sans-serif; background: #f8fafc; min-height: 100vh; }
  .pp-root h1,.pp-root h2,.pp-root h3 { font-family: 'Playfair Display', serif; }

  @keyframes pp-fadein { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .pp-hero-content > * { animation: pp-fadein 0.6s ease both; }
  .pp-hero-content > *:nth-child(1) { animation-delay: 0.1s; }
  .pp-hero-content > *:nth-child(2) { animation-delay: 0.25s; }
  .pp-hero-content > *:nth-child(3) { animation-delay: 0.38s; }

  .pp-nav-item { cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; }
  .pp-nav-item:hover { background: rgba(232,150,12,0.06); }
  .pp-nav-item.active { border-left-color: var(--theme); background: rgba(232,150,12,0.08); }
  .pp-nav-item.active span { color: var(--theme) !important; font-weight: 600; }

  .pp-section { animation: pp-fadein 0.5s ease both; }

  .pp-card { transition: box-shadow 0.2s; }
  .pp-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important; }

  .pp-highlight { border-left: 3px solid var(--theme); padding-left: 16px; }

  .pp-back-top { transition: all 0.2s; }
  .pp-back-top:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(232,150,12,0.3); }
`;

const SECTIONS = [
  {
    id: "collect",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/>
      </svg>
    ),
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information You Provide",
        text: "We collect information you provide directly to us — such as your name, email address, phone number, and travel preferences — when you create an account, submit a travel inquiry, or contact our support team.",
      },
      {
        subtitle: "Automatically Collected Data",
        text: "When you use our platform, we automatically collect certain information including your IP address, browser type, device identifiers, pages visited, and time spent on the platform to improve your experience.",
      },
      {
        subtitle: "Payment Information",
        text: "We do not store full payment card details. All payment transactions are processed through secure, PCI-compliant third-party payment processors.",
      },
    ],
  },
  {
    id: "use",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: "2. How We Use Your Data",
    content: [
      {
        subtitle: "Service Delivery",
        text: "Your data is primarily used to provide you with personalized travel planning services, process bookings, and send you relevant package recommendations based on your preferences.",
      },
      {
        subtitle: "Communication",
        text: "We use your contact information to send booking confirmations, travel updates, and — only with your explicit consent — promotional offers and newsletters.",
      },
      {
        subtitle: "Improvement & Analytics",
        text: "Aggregated and anonymized data helps us improve our platform, identify popular destinations, and build smarter holiday planning tools like our Holiday Calendar.",
      },
    ],
  },
  {
    id: "sharing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
    title: "3. Data Sharing",
    content: [
      {
        subtitle: "Third-Party Partners",
        text: "We share data with trusted travel partners (hotels, airlines, tour operators) only as necessary to fulfill your booking. All partners are contractually bound to protect your information.",
      },
      {
        subtitle: "We Never Sell Your Data",
        text: "We do not sell, trade, or rent your personal information to third parties for marketing purposes. Your data belongs to you.",
        highlight: true,
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information if required to do so by law, court order, or governmental authority.",
      },
    ],
  },
  {
    id: "cookies",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><circle cx="8" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="8" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/>
      </svg>
    ),
    title: "4. Cookies & Tracking",
    content: [
      {
        subtitle: "What We Use",
        text: "We use essential cookies to keep you logged in and remember your preferences. Analytics cookies (like Google Analytics) help us understand how the platform is used.",
      },
      {
        subtitle: "Your Control",
        text: "You can control or disable cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our services.",
      },
    ],
  },
  {
    id: "rights",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "5. Your Rights",
    content: [
      {
        subtitle: "Access & Correction",
        text: "You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us directly.",
      },
      {
        subtitle: "Data Deletion",
        text: "You may request deletion of your personal data. We will comply within 30 days, except where retention is required by law or for legitimate business purposes.",
      },
      {
        subtitle: "Data Portability",
        text: "You can request a copy of your data in a structured, machine-readable format to transfer to another service.",
      },
    ],
  },
  {
    id: "security",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    title: "6. Data Security",
    content: [
      {
        subtitle: "Our Measures",
        text: "We implement industry-standard security measures including SSL/TLS encryption, secure data centers, and regular security audits to protect your information from unauthorized access.",
      },
      {
        subtitle: "Breach Notification",
        text: "In the unlikely event of a data breach that affects your information, we will notify you within 72 hours of becoming aware of the breach.",
      },
    ],
  },
  {
    id: "contact",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z"/>
      </svg>
    ),
    title: "7. Contact Us",
    content: [
      {
        subtitle: "Privacy Queries",
        text: "If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please reach out to our dedicated Privacy Team.",
      },
      {
        subtitle: "Email",
        text: "privacy@travsplatform.com",
      },
      {
        subtitle: "Address",
        text: "travsplatform Pvt. Ltd., Indore, Madhya Pradesh, India — 452001",
      },
    ],
  },
];

export default function PrivacyPage({ pageData, pageId, isAdmin, onPageClick }) {
  const { updateSubpageField } = usePageContext();
  const themeColor = pageData?.themeColor || "#E8960C";
  const brandVal = pageData?.branding?.value || "travsplatform";

  const content = pageData?.subpageContents?.privacy || {
    heroTitle: "Privacy Policy",
    heroSubtitle: "Last updated: April 21, 2026 · Effective immediately",
    introText: `At ${brandVal}, your privacy is not an afterthought — it is a fundamental part of how we build our products. This Privacy Policy explains what data we collect, why we collect it, and how you remain in control at every step of your journey with us.`,
  };

  const handleSave = (field, val) => {
    updateSubpageField("privacy", field, val);
  };

  const [activeSection, setActiveSection] = useState("collect");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(`pp-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pp-root" style={{ "--theme": themeColor }}>
      <style>{CSS}</style>

      {/* ── Navbar ── */}
      <Navbar 
        branding={pageData?.branding} 
        themeColor={themeColor} 
        extraPages={pageData?.extraPages || []} 
        pageId={pageId} 
        isAdmin={isAdmin}
        onPageClick={onPageClick}
      />

      {/* ── Hero Banner ── */}
      <section style={{ position: "relative", height: 280, overflow: "hidden", background: "linear-gradient(135deg,#1a1f2e 0%,#16213e 55%,#0f3460 100%)" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 60%, rgba(232,150,12,0.12) 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", right: -50, top: -50, width: 260, height: 260, borderRadius: "50%", border: `1px solid rgba(232,150,12,0.18)` }} />
        <div style={{ position: "absolute", right: 60, top: 60, width: 140, height: 140, borderRadius: "50%", border: `1px solid rgba(232,150,12,0.1)` }} />
        <div style={{ position: "absolute", left: "55%", bottom: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(232,150,12,0.04)" }} />

        <div className="pp-hero-content" style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 14px", marginBottom: 18, backdropFilter: "blur(12px)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>Legal</span>
            </div>
            <h1 style={{ fontSize: 46, fontWeight: 900, color: "white", lineHeight: 1.1 }}>
              <EditableText
                value={content.heroTitle}
                onSave={(val) => handleSave("heroTitle", val)}
                isAdmin={isAdmin}
              />
            </h1>
            <p style={{ marginTop: 12, fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              <EditableText
                value={content.heroSubtitle}
                onSave={(val) => handleSave("heroSubtitle", val)}
                isAdmin={isAdmin}
              />
            </p>
          </div>
        </div>
      </section>

      {/* ── Body: Sidebar + Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignItems: "start" }}>

        {/* Sticky Sidebar */}
        <aside style={{ position: "sticky", top: 32 }}>
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#9ca3af", textTransform: "uppercase" }}>Contents</p>
            </div>
            {SECTIONS.map(s => (
              <div
                key={s.id}
                className={`pp-nav-item ${activeSection === s.id ? "active" : ""}`}
                onClick={() => scrollTo(s.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px" }}
              >
                <span style={{ color: activeSection === s.id ? themeColor : "#9ca3af", flexShrink: 0, display: "flex" }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: activeSection === s.id ? themeColor : "#6b7280", lineHeight: 1.4 }}>
                  {s.title.replace(/^\d+\.\s/, "")}
                </span>
              </div>
            ))}
          </div>

          {/* Last updated card */}
          <div style={{ marginTop: 16, background: "#FFF4E0", borderRadius: 14, padding: "16px 18px", border: `1px solid rgba(232,150,12,0.2)` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: themeColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Questions?</p>
            <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>Email us at<br />
              <a href="mailto:privacy@travsplatform.com" style={{ color: themeColor, fontWeight: 600, textDecoration: "none" }}>privacy@travsplatform.com</a>
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Intro card */}
          <div style={{ background: "#1a1f2e", borderRadius: 18, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", border: `1px solid rgba(232,150,12,0.15)` }} />
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, position: "relative", zIndex: 1 }}>
              <EditableText
                value={content.introText}
                onSave={(val) => handleSave("introText", val)}
                isAdmin={isAdmin}
                multiline
              />
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              id={`pp-${s.id}`}
              className="pp-section pp-card"
              style={{ background: "white", borderRadius: 18, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 28px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF4E0", display: "flex", alignItems: "center", justifyContent: "center", color: themeColor, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{s.title}</h2>
              </div>

              {/* Section body */}
              <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
                {s.content.map((item, i) => (
                  <div key={i} className={item.highlight ? "pp-highlight" : ""} style={item.highlight ? { borderLeftColor: themeColor } : {}}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.subtitle}</p>
                    <p style={{ fontSize: 14, color: item.highlight ? "#374151" : "#6b7280", lineHeight: 1.8 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom note */}
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: "20px 24px", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>
              This policy may be updated periodically. We will notify you of significant changes via email or a prominent notice on our platform.
              <br />
              <span style={{ color: themeColor, fontWeight: 600 }}>Continued use of our services constitutes acceptance of any revised policy.</span>
            </p>
          </div>
        </main>
      </div>

      {/* ── Back to Top ── */}
      {showBackTop && (
        <button
          className="pp-back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position: "fixed", bottom: 32, right: 32, width: 44, height: 44, borderRadius: "50%", background: themeColor, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(232,150,12,0.35)", zIndex: 50 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      )}

      {/* ── Footer ── */}
      <footer style={{ background: "#1a1f2e", padding: "36px 32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: themeColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "white" }}>{brandVal}</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms & Conditions", "Contact"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
              >{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 {brandVal}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}