// src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ branding, themeColor, extraPages = [], pageId, isAdmin, onPageClick }) {
  const brandingValue = branding?.value || "/logo3.png";
  const brandingType = branding?.type || "logo";
  const bgColor = themeColor || "#E8960C";

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
          if (subPageId) {
            if (onPageClick) onPageClick(subPageId);
          } else if (to.includes("#")) {
            // Anchor link in admin mode: go home first then scroll
            if (onPageClick) onPageClick(null);
            setTimeout(() => {
              const hash = to.split("#")[1];
              const el = document.getElementById(hash) || document.getElementById(`mt-${hash}`) || document.getElementById(`sps-${hash}`);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else {
            if (onPageClick) onPageClick(null);
          }
        }
      };
    }
    return { to };
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-6">
          {brandingType === "logo" && brandingValue ? (
            <LinkComponent {...getProps(homeUrl)} className="shrink-0 flex items-center" style={{ background: "none", border: "none", padding: 0 }}>
              <img
                src={brandingValue}
                alt="Logo"
                className="h-8 w-auto object-contain rounded"
              />
            </LinkComponent>
          ) : (
            <LinkComponent {...getProps(homeUrl)} className="text-gray-900 text-xl font-black tracking-tight" style={{ fontFamily: "Georgia, serif", background: "none", border: "none", padding: 0 }}>
              {brandingValue}
            </LinkComponent>
          )}
          
          <div className="h-6 w-px bg-gray-100 hidden md:block"></div>
        </div>

        {/* Center/Right: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <LinkComponent {...getProps(homeUrl)} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-600 transition-colors" style={{ background: "none", border: "none" }}>Home</LinkComponent>
          
          {/* Common Sections */}
          {["Destinations", "Packages", "Calendar", "Contact"].map(label => (
            <LinkComponent 
              key={label} 
              {...getProps(`${homeUrl}#${label.toLowerCase()}`)} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-600 transition-colors"
              style={{ background: "none", border: "none" }}
            >
              {label}
            </LinkComponent>
          ))}

          {/* Extra Pages Links */}
          {extraPages.length > 0 && <div className="h-4 w-px bg-gray-200 mx-2" />}
          
          {extraPages.map((pId) => (
            <LinkComponent 
              key={pId} 
              {...getProps(`${homeUrl}?subPage=${pId}`, pId)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-600 transition-colors"
              style={{ background: "none", border: "none" }}
            >
              {PAGE_MAP[pId] || pId}
            </LinkComponent>
          ))}
        </nav>

        {/* Mobile Spacer */}
        <div className="md:hidden" />
      </div>
    </header>
  );
}
