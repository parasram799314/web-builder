// src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ branding, themeColor, extraPages = [], pageId, isAdmin, onPageClick }) {
  const brandingValue = branding?.value || "travsplatform";
  const brandingType = branding?.type || "text";
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
          if (onPageClick) onPageClick(subPageId);
        }
      };
    }
    return { to };
  };

  return (
    <nav
      style={{ backgroundColor: bgColor }}
      className="px-8 py-0 flex items-center justify-between h-14 shadow-md w-full z-40"
    >
      {/* Logo / Branding */}
      {brandingType === "logo" && brandingValue ? (
        <LinkComponent {...getProps(homeUrl)}>
          <img
            src={brandingValue}
            alt="Logo"
            className="h-9 w-auto object-contain rounded"
          />
        </LinkComponent>
      ) : (
        <LinkComponent {...getProps(homeUrl)} className="text-white text-2xl font-black tracking-tight" style={{ fontFamily: "Georgia, serif", background: "none", border: "none" }}>
          {brandingValue}
        </LinkComponent>
      )}

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        <LinkComponent {...getProps(homeUrl)} className="text-white text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ background: "none", border: "none" }}>Home</LinkComponent>
        {extraPages.map((pId) => (
          <LinkComponent 
            key={pId} 
            {...getProps(`${homeUrl}?subPage=${pId}`, pId)}
            className="text-white text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            style={{ background: "none", border: "none" }}
          >
            {PAGE_MAP[pId] || pId}
          </LinkComponent>
        ))}
      </div>

      <div className="md:hidden" />
    </nav>
  );
}
