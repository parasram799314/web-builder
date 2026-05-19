// src/website-buildpage/HelpPage.jsx
// Help Center Page — styled to match ModernTravel layout theme
// Same fonts (Playfair Display + Space Grotesk), themeColor, dark navy palette

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import EditableText from "../components/Common/EditableText";
import { usePageContext } from "../context/PageContext";

// ─── CSS Injection ────────────────────────────────────────────────────────────
const HELP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

.help-layout { font-family: 'Space Grotesk', sans-serif; }
.help-layout h1, .help-layout h2, .help-layout h3, .help-layout h4 {
  font-family: 'Playfair Display', serif;
}

@keyframes help-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes help-marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.help-fade-up { animation: help-fade-up 0.7s ease both; }
.help-fade-up-d1 { animation: help-fade-up 0.7s 0.12s ease both; }
.help-fade-up-d2 { animation: help-fade-up 0.7s 0.24s ease both; }

.help-faq-item {
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  background: white;
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.help-faq-item:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.07);
}
.help-faq-item.open {
  box-shadow: 0 8px 32px rgba(0,0,0,0.09);
}

.help-faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              padding 0.3s ease;
}
.help-faq-answer.open {
  max-height: 400px;
}

.help-search-input:focus {
  outline: none;
}

.help-cat-btn {
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-family: 'Space Grotesk', sans-serif;
}

.help-contact-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.help-contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.1);
}
`;

function injectHelpCSS() {
  if (document.getElementById("help-layout-css")) return;
  const s = document.createElement("style");
  s.id = "help-layout-css";
  s.textContent = HELP_CSS;
  document.head.appendChild(s);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    category: "Booking",
    icon: "🎫",
    items: [
      {
        q: "How do I book a travel package?",
        a: "Browse our packages section, pick your preferred destination and dates using the Holiday Calendar, then click 'Submit Inquiry'. Our team will confirm your booking within 24 hours with a full itinerary and payment details.",
      },
      {
        q: "Can I book for a group or family?",
        a: "Absolutely! Our packages support group bookings of any size. Just mention the number of travellers and ages (especially for kids) in the inquiry form. We'll customize pricing and accommodations accordingly.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 15–30 days in advance for peak season travel (October–February & May–June). For off-season trips, 7–10 days is usually sufficient. Last-minute bookings are subject to availability.",
      },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, net banking, UPI (GPay, PhonePe, Paytm), and bank transfers. International payments via Visa and Mastercard are also supported.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All transactions are processed through PCI-DSS compliant payment gateways with 256-bit SSL encryption. We never store your card details on our servers.",
      },
      {
        q: "Do I need to pay the full amount upfront?",
        a: "No. We require a 30% advance to confirm your booking. The remaining 70% can be paid 7 days before your departure. For bookings made within 7 days of travel, full payment is required at the time of booking.",
      },
    ],
  },
  {
    category: "Cancellations",
    icon: "🔄",
    items: [
      {
        q: "What is your cancellation policy?",
        a: "Cancellations made 15+ days before departure: full refund. 7–14 days: 50% refund. Less than 7 days: no refund. In case of natural disasters or government travel advisories, we offer free rescheduling.",
      },
      {
        q: "How do I cancel my booking?",
        a: "Email us at support@travsplatform.com with your booking ID and reason for cancellation. Refunds (where applicable) are processed within 5–7 business days to your original payment method.",
      },
    ],
  },
  {
    category: "Custom Trips",
    icon: "✏️",
    items: [
      {
        q: "Can you create a custom itinerary for me?",
        a: "Yes! Use the Contact form on our website and describe your dream trip — destination, duration, budget, and preferences. Our travel experts will craft a personalised itinerary within 48 hours.",
      },
      {
        q: "Do you handle visa and documentation?",
        a: "We provide visa guidance and documentation checklists for all international destinations. For select countries, we also offer visa application assistance as an add-on service.",
      },
    ],
  },
];

const MARQUEE_TOPICS = [
  { emoji: "🎫", text: "Easy Booking Process" },
  { emoji: "💬", text: "24/7 Customer Support" },
  { emoji: "🔄", text: "Flexible Cancellations" },
  { emoji: "🔒", text: "Secure Payments" },
  { emoji: "✏️", text: "Custom Itineraries" },
  { emoji: "🌍", text: "500+ Destinations" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HelpHero({ themeColor, content, isAdmin, onSave, searchQuery, setSearchQuery }) {
  const color = themeColor || "#E8960C";

  return (
    <section style={{ position: "relative", minHeight: "48vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
          alt="Help Center"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,15,30,0.65) 0%, rgba(10,15,30,0.5) 50%, rgba(10,15,30,0.8) 100%)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px", paddingTop: 80, textAlign: "center" }}>
        <div className="help-fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)", borderRadius: 999, padding: "6px 14px", marginBottom: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
          <EditableText
            value={content.heroBadge}
            onSave={(val) => onSave("heroBadge", val)}
            isAdmin={isAdmin}
            style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.2em", textTransform: "uppercase" }}
          />
        </div>

        <h1 className="help-fade-up-d1" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900,
          color: "white", lineHeight: 1.1, margin: "0 0 14px",
        }}>
          <EditableText
            value={content.heroTitle}
            onSave={(val) => onSave("heroTitle", val)}
            isAdmin={isAdmin}
            multiline
          />
        </h1>

        <p className="help-fade-up-d1" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 30px", lineHeight: 1.7 }}>
          <EditableText
            value={content.heroSubtitle}
            onSave={(val) => onSave("heroSubtitle", val)}
            isAdmin={isAdmin}
            multiline
          />
        </p>

        {/* Search Bar */}
        <div className="help-fade-up-d2" style={{ maxWidth: 560, margin: "0 auto 32px", position: "relative" }}>
          <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            className="help-search-input"
            type="text"
            placeholder="Search your question... e.g. cancel booking"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14,
              padding: "14px 18px 14px 44px",
              fontSize: 13, color: "white",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
        </div>

        {/* Stats */}
        <div className="help-fade-up-d2" style={{ display: "flex", gap: 36, justifyContent: "center", paddingBottom: 28 }}>
          {[{ v: "24/7", l: "Support" }, { v: "< 2h", l: "Avg. Reply" }, { v: "98%", l: "Resolved" }].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function HelpMarquee({ themeColor }) {
  const color = themeColor || "#E8960C";
  const doubled = [...MARQUEE_TOPICS, ...MARQUEE_TOPICS];
  return (
    <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${color}08, ${color}14)`, borderTop: `1px solid ${color}22`, borderBottom: `1px solid ${color}22` }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 2, background: "linear-gradient(to right, #f8fafc, transparent)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 2, background: "linear-gradient(to left, #f8fafc, transparent)", pointerEvents: "none" }} />
      <div
        style={{ display: "flex", width: "max-content", animation: "help-marquee-scroll 28s linear infinite", padding: "12px 0" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: `1px solid ${color}28`, borderRadius: 999, padding: "5px 14px", marginRight: 12, boxShadow: `0 1px 6px ${color}12`, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 13 }}>{item.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{item.text}</span>
            </div>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: `${color}50`, marginRight: 12, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQItem({ faq, index, themeColor, isOpen, onToggle }) {
  const color = themeColor || "#E8960C";
  return (
    <div
      className={`help-faq-item ${isOpen ? "open" : ""}`}
      style={{ borderColor: isOpen ? `${color}30` : "#f1f5f9" }}
    >
      {/* Question row */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 14, padding: "20px 24px",
          textAlign: "left", fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Number badge */}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: isOpen ? color : `${color}14`,
          color: isOpen ? "white" : color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700,
          transition: "all 0.25s",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        <span style={{
          flex: 1, fontSize: 15, fontWeight: 600,
          color: isOpen ? "#111827" : "#374151",
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {faq.q}
        </span>

        {/* Chevron */}
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: isOpen ? `${color}15` : "#f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s",
        }}>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={isOpen ? color : "#9ca3af"} strokeWidth="2.5"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div className={`help-faq-answer ${isOpen ? "open" : ""}`}>
        <div style={{
          padding: "0 24px 22px 70px",
          fontSize: 14, color: "#6b7280", lineHeight: 1.75,
          borderTop: isOpen ? `1px solid ${color}18` : "none",
          paddingTop: isOpen ? 16 : 0,
        }}>
          {faq.a}
        </div>
      </div>
    </div>
  );
}

// ─── Contact Cards ─────────────────────────────────────────────────────────────
function ContactCards({ themeColor }) {
  const color = themeColor || "#E8960C";
  const cards = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
      title: "Live Chat",
      desc: "Chat with our travel experts instantly. Available 9 AM – 9 PM IST.",
      cta: "Start Chat",
      highlight: true,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      title: "Email Support",
      desc: "Drop us an email and we'll respond within 2 hours on weekdays.",
      cta: "Send Email",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.0 1.2 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
        </svg>
      ),
      title: "Call Us",
      desc: "Speak directly with our team. Toll-free: 1800-XXX-XXXX.",
      cta: "Call Now",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
      {cards.map((card, i) => (
        <div key={i} className="help-contact-card" style={{
          background: card.highlight ? color : "white",
          border: `1px solid ${card.highlight ? color : "#f1f5f9"}`,
          borderRadius: 18, padding: "28px 24px",
          boxShadow: card.highlight ? `0 8px 32px ${color}35` : "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, marginBottom: 16,
            background: card.highlight ? "rgba(255,255,255,0.2)" : `${color}12`,
            color: card.highlight ? "white" : color,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {card.icon}
          </div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 17, fontWeight: 700,
            color: card.highlight ? "white" : "#111827",
            margin: "0 0 8px",
          }}>{card.title}</h3>
          <p style={{
            fontSize: 13, lineHeight: 1.65,
            color: card.highlight ? "rgba(255,255,255,0.75)" : "#6b7280",
            margin: "0 0 20px",
          }}>{card.desc}</p>
          <button style={{
            width: "100%", padding: "10px 0", borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            background: card.highlight ? "rgba(255,255,255,0.18)" : `${color}12`,
            border: `1.5px solid ${card.highlight ? "rgba(255,255,255,0.35)" : `${color}30`}`,
            color: card.highlight ? "white" : color,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = card.highlight ? "rgba(255,255,255,0.28)" : color;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = card.highlight ? "rgba(255,255,255,0.18)" : `${color}12`;
              e.currentTarget.style.color = card.highlight ? "white" : color;
            }}
          >
            {card.cta} →
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function HelpFooter({ branding, themeColor, extraPages = [], pageId }) {
  const color = themeColor || "#E8960C";
  const brandVal = branding?.value || "travsplatform";
  const brandType = branding?.type || "text";
  return (
    <footer style={{ background: "#1a1f2e", color: "#e5e7eb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              {brandType === "logo" && branding?.value ? (
                <img src={branding.value} alt="Logo" style={{ height: 26, objectFit: "contain" }} />
              ) : (
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}>{brandVal}</span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>
              Smart travel planning with holiday calendars, curated packages, and exclusive deals.
            </p>
          </div>
          {[
            { heading: "Quick Links", links: ["Destinations", "Packages", "Flights", "Hotels"] },
            { heading: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms"] },
            { heading: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
          ].map(col => (
            <div key={col.heading}>
              <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#4b5563", marginBottom: 18 }}>{col.heading}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "white"}
                      onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, textAlign: "center", fontSize: 12, color: "#4b5563" }}>
          © 2026 {brandVal}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Main HelpPage ─────────────────────────────────────────────────────────────
export default function HelpPage({ pageData, pageId, isAdmin, onPageClick }) {
  const { updateSubpageField } = usePageContext();
  useEffect(() => { injectHelpCSS(); }, []);

  const themeColor = pageData?.themeColor || "#E8960C";
  const branding = pageData?.branding;

  const content = pageData?.subpageContents?.help || {
    heroBadge: "Help Center",
    heroTitle: "How can we help you today?",
    heroSubtitle: "Find answers to frequently asked questions, detailed guides, and support resources for your next adventure.",
    categoryBadge: "Knowledge Base",
    categoryTitle: "Browse by Category",
    faqBadge: "FAQ",
    faqTitle: "Frequently Asked Questions",
    contactBadge: "Still need help?",
    contactTitle: "We're here for you",
    contactDesc: "Can't find what you're looking for? Our support team is available 24/7 to assist with your travel plans.",
  };

  const handleSave = (field, val) => {
    updateSubpageField("help", field, val);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openItems, setOpenItems] = useState({ "0-0": true }); // first item open by default

  const categories = ["All", ...FAQ_DATA.map(c => c.category)];

  const toggleItem = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter FAQs by search + category
  const filteredCategories = FAQ_DATA
    .filter(cat => activeCategory === "All" || cat.category === activeCategory)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !searchQuery ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(cat => cat.items.length > 0);

  const totalResults = filteredCategories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="help-layout" style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar + Hero */}
      <div style={{ position: "relative" }}>
        <Navbar 
          branding={branding} 
          themeColor={themeColor} 
          extraPages={pageData?.extraPages} 
          pageId={pageId} 
          isAdmin={isAdmin}
          onPageClick={onPageClick}
        />
        <HelpHero themeColor={themeColor} content={content} isAdmin={isAdmin} onSave={handleSave} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Marquee */}
      <HelpMarquee themeColor={themeColor} />

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "60px 24px" }}>

        {/* Contact Cards */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: themeColor }}>
              Get In Touch
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>
              Contact Our Team
            </h2>
          </div>
          <ContactCards themeColor={themeColor} />
        </div>

        {/* FAQ Section */}
        <div>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifySelf: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: themeColor }}>
                <EditableText
                  value={content.faqBadge}
                  onSave={(val) => handleSave("faqBadge", val)}
                  isAdmin={isAdmin}
                />
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>
                <EditableText
                  value={content.faqTitle}
                  onSave={(val) => handleSave("faqTitle", val)}
                  isAdmin={isAdmin}
                />
              </h2>
            </div>
            {searchQuery && (
              <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {categories.map(cat => {
              const isActive = cat === activeCategory;
              return (
                <button key={cat} className="help-cat-btn"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: isActive ? themeColor : "white",
                    color: isActive ? "white" : "#6b7280",
                    boxShadow: isActive ? `0 4px 12px ${themeColor}40` : "0 1px 4px rgba(0,0,0,0.07)",
                  }}
                >{cat}</button>
              );
            })}
          </div>

          {/* FAQ Groups */}
          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>No results found for &ldquo;{searchQuery}&rdquo;</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Try a different search term or browse by category.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {filteredCategories.map((cat, ci) => (
                <div key={cat.category}>
                  {/* Category label */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${themeColor}14`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 17,
                    }}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                        {cat.category}
                      </h3>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{cat.items.length} question{cat.items.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  {/* FAQ items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {cat.items.map((faq, fi) => {
                      const key = `${ci}-${fi}`;
                      return (
                        <FAQItem
                          key={key}
                          faq={faq}
                          index={fi}
                          themeColor={themeColor}
                          isOpen={!!openItems[key]}
                          onToggle={() => toggleItem(key)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Still need help banner */}
        <div style={{
          marginTop: 60,
          borderRadius: 20,
          background: `linear-gradient(135deg, #1a1f2e 0%, #16213e 50%, #0f3460 100%)`,
          padding: "44px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 24,
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999, padding: "4px 12px", marginBottom: 12,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: themeColor, display: "inline-block" }} />
              <EditableText
                value={content.contactBadge}
                onSave={(val) => handleSave("contactBadge", val)}
                isAdmin={isAdmin}
                style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em", textTransform: "uppercase" }}
              />
            </div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 24, fontWeight: 700, color: "white", margin: "0 0 8px",
            }}>
              <EditableText
                value={content.contactTitle}
                onSave={(val) => handleSave("contactTitle", val)}
                isAdmin={isAdmin}
              />
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
              <EditableText
                value={content.contactDesc}
                onSave={(val) => handleSave("contactDesc", val)}
                isAdmin={isAdmin}
                multiline
              />
            </p>
          </div>
          <button style={{
            background: themeColor, color: "white", border: "none",
            borderRadius: 12, padding: "13px 28px",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            flexShrink: 0, display: "flex", alignItems: "center", gap: 8,
            boxShadow: `0 8px 24px ${themeColor}50`,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Contact Support
          </button>
        </div>
      </main>

      {/* Footer */}
      <HelpFooter branding={branding} themeColor={themeColor} extraPages={pageData?.extraPages} pageId={pageId} />
    </div>
  );
}
