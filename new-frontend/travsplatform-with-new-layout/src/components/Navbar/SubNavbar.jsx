import React from "react";
import { Link } from "react-router-dom";

export default function SubNavbar({ themeColor, extraPages = [], pageId, isAdmin, onPageClick }) {
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
    <div
      style={{ backgroundColor: `${bgColor}CC`, backdropFilter: "blur(8px)" }}
      className="px-8 py-2 flex items-center justify-center gap-8 w-full z-30 border-t border-white/10"
    >
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
  );
}
