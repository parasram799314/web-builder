// src/website-buildpage/BlogPage.jsx
// Blog Page — styled to match ModernTravel layout theme
// Uses same fonts (Playfair Display + Space Grotesk), themeColor, dark navy palette

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import EditableText from "../components/Common/EditableText";
import { usePageContext } from "../context/PageContext";

// ─── CSS Injection ────────────────────────────────────────────────────────────
const BLOG_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

.blog-layout { font-family: 'Space Grotesk', sans-serif; }
.blog-layout h1, .blog-layout h2, .blog-layout h3, .blog-layout h4 {
  font-family: 'Playfair Display', serif;
}

@keyframes blog-marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes blog-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes blog-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.blog-card {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s ease;
  will-change: transform;
}
.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 48px rgba(0,0,0,0.12);
}
.blog-card:hover .blog-card-img {
  transform: scale(1.07);
}
.blog-card-img {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.blog-hero-animate {
  animation: blog-fade-up 0.8s ease both;
}
.blog-hero-animate-delay {
  animation: blog-fade-up 0.8s 0.15s ease both;
}
.blog-hero-animate-delay2 {
  animation: blog-fade-up 0.8s 0.3s ease both;
}

.blog-featured-tag {
  background: linear-gradient(90deg, var(--tc) 0%, var(--tc-light) 100%);
  background-size: 200% auto;
}

.blog-read-btn {
  position: relative;
  overflow: hidden;
}
.blog-read-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.15);
  opacity: 0;
  transition: opacity 0.2s;
}
.blog-read-btn:hover::after {
  opacity: 1;
}
`;

function injectBlogCSS() {
  if (document.getElementById("blog-layout-css")) return;
  const s = document.createElement("style");
  s.id = "blog-layout-css";
  s.textContent = BLOG_CSS;
  document.head.appendChild(s);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Hidden Gems You Must Visit in Rajasthan",
    excerpt: "Beyond Jaipur and Udaipur lies a world of forgotten forts, quiet villages, and turquoise stepwells that few travellers ever discover.",
    category: "Discovery",
    readTime: "6 min read",
    date: "April 20, 2026",
    author: { name: "Priya Sharma", avatar: "PS" },
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
    featured: true,
    tags: ["Rajasthan", "Off-beat"],
  },
  {
    id: 2,
    title: "Solo Travel in Southeast Asia: Your Ultimate 2026 Guide",
    excerpt: "From Bangkok night markets to Bali rice terraces — everything you need to plan a safe, affordable, and unforgettable solo adventure.",
    category: "Guides",
    readTime: "9 min read",
    date: "April 15, 2026",
    author: { name: "Arjun Mehta", avatar: "AM" },
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80",
    tags: ["Southeast Asia", "Solo Travel"],
  },
  {
    id: 3,
    title: "Sustainable Travel: How to Explore the World Responsibly",
    excerpt: "Small choices — the hotel you book, the transport you take — can dramatically reduce your carbon footprint without reducing the magic.",
    category: "Eco-Travel",
    readTime: "5 min read",
    date: "April 10, 2026",
    author: { name: "Nisha Verma", avatar: "NV" },
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80",
    tags: ["Eco", "Responsible"],
  },
  {
    id: 4,
    title: "The Himalayas in Monsoon: Worth the Risk?",
    excerpt: "Lush green valleys, dramatic waterfalls, and empty trails — but also landslides and leeches. Here's the honest guide to trekking in the rains.",
    category: "Adventure",
    readTime: "7 min read",
    date: "April 5, 2026",
    author: { name: "Rohan Das", avatar: "RD" },
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    tags: ["Himalayas", "Trekking"],
  },
  {
    id: 5,
    title: "Kerala Backwaters: A Slow Travel Experience",
    excerpt: "Trading speed for stillness — a week on a houseboat through the waterways of God's Own Country, watching life unfold at its own pace.",
    category: "Experiences",
    readTime: "5 min read",
    date: "March 30, 2026",
    author: { name: "Meera Iyer", avatar: "MI" },
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
    tags: ["Kerala", "Slow Travel"],
  },
  {
    id: 6,
    title: "Best Street Food Cities in India You Must Try",
    excerpt: "Kolkata's kathi rolls, Mumbai's vada pav, Delhi's chaat — the real culture of a city is always on its streets. A hungry traveller's handbook.",
    category: "Food & Culture",
    readTime: "4 min read",
    date: "March 25, 2026",
    author: { name: "Vikram Bose", avatar: "VB" },
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
    tags: ["Food", "Culture"],
  },
];

const MARQUEE_ITEMS = [
  { emoji: "✈️", text: "500+ Curated Destinations" },
  { emoji: "📖", text: "Weekly Travel Stories" },
  { emoji: "🌿", text: "Eco-Friendly Tips & Guides" },
  { emoji: "🏔️", text: "Adventure Travel Insights" },
  { emoji: "🍜", text: "Local Food & Culture" },
  { emoji: "🗺️", text: "Expert Itineraries" },
];

const CATEGORIES = ["All", "Discovery", "Guides", "Eco-Travel", "Adventure", "Experiences", "Food & Culture"];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function BlogHero({ themeColor, content, isAdmin, onSave }) {
  const color = themeColor || "#E8960C";

  return (
    <section style={{ position: "relative", minHeight: "52vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80"
          alt="Travel Blog Hero"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,15,30,0.6) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.75) 100%)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px", paddingTop: 80 }}>
        {/* Badge */}
        <div className="blog-hero-animate" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)", borderRadius: 999, padding: "6px 14px",
          marginBottom: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
          <EditableText
            value={content.heroBadge}
            onSave={(val) => onSave("heroBadge", val)}
            isAdmin={isAdmin}
            style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.2em", textTransform: "uppercase" }}
          />
        </div>

        {/* Title */}
        <h1 className="blog-hero-animate-delay" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(36px, 5vw, 60px)",
          fontWeight: 900,
          color: "white",
          lineHeight: 1.1,
          maxWidth: 680,
          margin: "0 0 16px",
        }}>
          <EditableText
            value={content.heroTitle}
            onSave={(val) => onSave("heroTitle", val)}
            isAdmin={isAdmin}
            multiline
          />
        </h1>

        {/* Subtitle */}
        <p className="blog-hero-animate-delay2" style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 480, lineHeight: 1.7, margin: "0 0 28px" }}>
          <EditableText
            value={content.heroSubtitle}
            onSave={(val) => onSave("heroSubtitle", val)}
            isAdmin={isAdmin}
            multiline
          />
        </p>

        {/* Stats row */}
        <div className="blog-hero-animate-delay2" style={{ display: "flex", gap: 40, paddingBottom: 24 }}>
          {[{ v: "120+", l: "Articles" }, { v: "48", l: "Countries" }, { v: "10K+", l: "Readers" }].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function BlogMarquee({ themeColor }) {
  const color = themeColor || "#E8960C";
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${color}08, ${color}14)`, borderTop: `1px solid ${color}22`, borderBottom: `1px solid ${color}22` }}>
      {/* Left fade */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 2, background: "linear-gradient(to right, white, transparent)", pointerEvents: "none" }} />
      {/* Right fade */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 2, background: "linear-gradient(to left, white, transparent)", pointerEvents: "none" }} />

      <div
        style={{ display: "flex", width: "max-content", animation: "blog-marquee-scroll 30s linear infinite", padding: "12px 0" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "white", border: `1px solid ${color}28`,
              borderRadius: 999, padding: "5px 14px", marginRight: 12,
              boxShadow: `0 1px 6px ${color}12`, whiteSpace: "nowrap",
            }}>
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

// ─── Featured Post ─────────────────────────────────────────────────────────────
function FeaturedPost({ post, themeColor }) {
  const color = themeColor || "#E8960C";

  return (
    <div className="blog-card" style={{
      borderRadius: 20, overflow: "hidden", background: "white",
      border: "1px solid #f1f5f9", position: "relative",
      display: "grid", gridTemplateColumns: "1fr 1fr",
      minHeight: 400,
    }}>
      {/* Image side */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        <img
          className="blog-card-img"
          src={post.image}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80"; }}
        />
        {/* Featured badge */}
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: color, color: "white",
          borderRadius: 999, padding: "4px 12px",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          ★ Featured
        </div>
      </div>

      {/* Content side */}
      <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{
            background: `${color}15`, color, borderRadius: 6,
            padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            {post.category}
          </span>
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{post.readTime}</span>
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 26, fontWeight: 700, color: "#111827",
          lineHeight: 1.3, margin: "0 0 14px",
        }}>
          {post.title}
        </h2>

        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: "0 0 24px" }}>
          {post.excerpt}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
          {post.tags.map(t => (
            <span key={t} style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", borderRadius: 6, padding: "2px 10px", fontWeight: 500 }}>
              #{t}
            </span>
          ))}
        </div>

        {/* Author + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f3f4f6", paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `${color}20`, color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
            }}>
              {post.author.avatar}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{post.author.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{post.date}</div>
            </div>
          </div>
          <button className="blog-read-btn" style={{
            background: color, color: "white", border: "none",
            borderRadius: 10, padding: "10px 20px",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            Read Story
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, themeColor }) {
  const color = themeColor || "#E8960C";

  return (
    <div className="blog-card" style={{
      borderRadius: 16, overflow: "hidden", background: "white",
      border: "1px solid #f1f5f9",
      display: "flex", flexDirection: "column",
    }}>
      {/* Image */}
      <div style={{ overflow: "hidden", height: 200, position: "relative", flexShrink: 0 }}>
        <img
          className="blog-card-img"
          src={post.image}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"; }}
        />
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
          color: "white", borderRadius: 999, padding: "3px 12px",
          fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {post.readTime}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <span style={{
          background: `${color}12`, color,
          borderRadius: 6, padding: "3px 10px",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", display: "inline-block", marginBottom: 12,
        }}>
          {post.category}
        </span>

        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 17, fontWeight: 700, color: "#111827",
          lineHeight: 1.35, margin: "0 0 10px", flex: 1,
        }}>
          {post.title}
        </h3>

        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 18px" }}>
          {post.excerpt.slice(0, 100)}...
        </p>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `${color}18`, color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
            }}>
              {post.author.avatar}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{post.author.name}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{post.date}</div>
            </div>
          </div>
          <button style={{
            background: "transparent", border: `1.5px solid ${color}40`,
            color, borderRadius: 8, padding: "6px 14px",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = color; }}
          >
            Read →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Newsletter Banner ─────────────────────────────────────────────────────────
function NewsletterBanner({ themeColor }) {
  const color = themeColor || "#E8960C";
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section style={{
      background: `linear-gradient(135deg, #1a1f2e 0%, #16213e 50%, #0f3460 100%)`,
      padding: "60px 24px",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 999, padding: "5px 14px", marginBottom: 18,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Newsletter
          </span>
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 30, fontWeight: 700, color: "white",
          margin: "0 0 10px", lineHeight: 1.2,
        }}>
          Never Miss a Story
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", lineHeight: 1.7 }}>
          Get the latest travel guides, destination spotlights, and exclusive deals delivered to your inbox every week.
        </p>
        {done ? (
          <div style={{ fontSize: 15, color: color, fontWeight: 600 }}>✓ You're subscribed — happy travels! ✈️</div>
        ) : (
          <div style={{ display: "flex", gap: 0, maxWidth: 420, margin: "0 auto", borderRadius: 12, overflow: "hidden", border: `1px solid rgba(255,255,255,0.12)` }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: 1, background: "rgba(255,255,255,0.07)",
                border: "none", outline: "none", padding: "13px 18px",
                fontSize: 13, color: "white",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />
            <button
              onClick={() => email && setDone(true)}
              style={{
                background: color, border: "none", color: "white",
                padding: "13px 22px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function BlogFooter({ branding, themeColor, extraPages = [], pageId }) {
  const color = themeColor || "#E8960C";
  const brandVal = branding?.value || "travsplatform";
  const brandType = branding?.type || "text";

  return (
    <footer style={{ background: "#1a1f2e", color: "#e5e7eb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40 }}>
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              {brandType === "logo" && branding?.value ? (
                <img src={branding.value} alt="Logo" style={{ height: 26, objectFit: "contain" }} />
              ) : (
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}>{brandVal}</span>
              )}
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>
              Inspiring journeys through stories, guides, and honest travel insights from around the globe.
            </p>
          </div>
          {[
            { heading: "Quick Links", links: ["Destinations", "Packages", "Flights", "Hotels"] },
            { heading: "Blog", links: ["Discovery", "Guides", "Eco-Travel", "Adventure"] },
            { heading: "Company", links: ["About Us", "Contact", "Privacy", "Terms"] },
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
          © 2026 {brandVal}. All rights reserved. Made with ❤️ for travellers.
        </div>
      </div>
    </footer>
  );
}

// ─── Main BlogPage ─────────────────────────────────────────────────────────────
export default function BlogPage({ pageData, pageId, isAdmin, onPageClick }) {
  const { updateSubpageField } = usePageContext();
  useEffect(() => { injectBlogCSS(); }, []);

  const themeColor = pageData?.themeColor || "#E8960C";
  const branding = pageData?.branding;

  const content = pageData?.subpageContents?.blog || {
    heroBadge: "Travel Stories & Insights",
    heroTitle: "Stories That Inspire Your Next Journey",
    heroSubtitle: "Curated travel stories, destination guides, and insider tips from explorers around the world.",
    featuredBadge: "Featured Story",
    featuredTitle: "Editor's Pick",
    categoryBadge: "Browse by Category",
    categoryTitle: "Latest Articles",
    newsletterBadge: "Newsletter",
    newsletterTitle: "Never Miss a Story",
    newsletterDesc: "Get the latest travel guides, destination spotlights, and exclusive deals delivered to your inbox every week.",
  };

  const handleSave = (field, val) => {
    updateSubpageField("blog", field, val);
  };

  const [activeCategory, setActiveCategory] = useState("All");

  const featured = BLOG_POSTS.find(p => p.featured);
  const rest = BLOG_POSTS.filter(p => !p.featured);

  const filtered = activeCategory === "All"
    ? rest
    : rest.filter(p => p.category === activeCategory);

  return (
    <div className="blog-layout" style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
        <BlogHero themeColor={themeColor} content={content} isAdmin={isAdmin} onSave={handleSave} />
      </div>

      {/* Marquee */}
      <BlogMarquee themeColor={themeColor} />

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "60px 24px" }}>

        {/* Featured Post */}
        {featured && (
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", justifySelf: "space-between", marginBottom: 24 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: themeColor }}>
                  <EditableText
                    value={content.featuredBadge}
                    onSave={(val) => handleSave("featuredBadge", val)}
                    isAdmin={isAdmin}
                  />
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>
                  <EditableText
                    value={content.featuredTitle}
                    onSave={(val) => handleSave("featuredTitle", val)}
                    isAdmin={isAdmin}
                  />
                </h2>
              </div>
              <a href="#" style={{ fontSize: 12, fontWeight: 600, color: themeColor, textDecoration: "none" }}>
                View all articles →
              </a>
            </div>
            <FeaturedPost post={featured} themeColor={themeColor} />
          </div>
        )}

        {/* Category Filter */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifySelf: "space-between", marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: themeColor }}>
                <EditableText
                  value={content.categoryBadge}
                  onSave={(val) => handleSave("categoryBadge", val)}
                  isAdmin={isAdmin}
                />
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>
                <EditableText
                  value={content.categoryTitle}
                  onSave={(val) => handleSave("categoryTitle", val)}
                  isAdmin={isAdmin}
                />
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: isActive ? themeColor : "white",
                    color: isActive ? "white" : "#6b7280",
                    boxShadow: isActive ? `0 4px 12px ${themeColor}40` : "0 1px 4px rgba(0,0,0,0.07)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {filtered.map(post => (
            <PostCard key={post.id} post={post} themeColor={themeColor} />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>No articles in this category yet.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button style={{
            background: "white", border: `1.5px solid ${themeColor}40`,
            color: themeColor, borderRadius: 12, padding: "13px 36px",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = themeColor; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = themeColor; }}
          >
            Load More Articles
          </button>
        </div>
      </main>

      {/* Newsletter */}
      <NewsletterBanner themeColor={themeColor} content={content} isAdmin={isAdmin} onSave={handleSave} />

      {/* Footer */}
      <BlogFooter branding={branding} themeColor={themeColor} extraPages={pageData?.extraPages} pageId={pageId} />
    </div>
  );
}
