// src/components/Admin/GenerateLinkModal.jsx
import React, { useState } from "react";
import { usePageContext } from "../../context/PageContext";
import { getLayoutById } from "../../layouts/index";

export default function GenerateLinkModal({ toolMode, onClose }) {
  const { pageData, publishedData, publishPage, publishing, currentPageId, pageName, setPageName } = usePageContext();

  // FIX: Use publishedData.published to correctly track if this page is already live
  const [generated, setGenerated] = useState(!!(publishedData?.published || (currentPageId && pageData?.published)));
  const [copied, setCopied] = useState(false);

  const modeParam = toolMode === "calendar" ? "?mode=calendar" : "?mode=website";

  const externalSiteUrl = process.env.REACT_APP_EXTERNAL_SITE || window.location.origin;
  const viewUrl = currentPageId
    ? `${externalSiteUrl}/view/${currentPageId}${modeParam}`
    : "Save/Publish first to get link";

  const handleGenerate = async () => {
    const success = await publishPage(pageName, toolMode);
    if (success) {
      setGenerated(true);
    }
  };

  const handleCopy = () => {
    if (!currentPageId) return;
    navigator.clipboard.writeText(viewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Sub-pages linked to this website
  const extraPages = pageData?.extraPages || [];
  const PAGE_MAP = {
    about: "About",
    blog: "Blog",
    help: "Help",
    contact_page: "Contact",
    privacy: "Privacy",
    terms: "Terms",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "#fff7ed" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8960C" strokeWidth="2">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {generated ? "Your Page is Live! 🎉" : "Publish & Generate Link"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {generated
            ? "Share this link with your clients. They can view your published page."
            : "Apne page ko ek naam dein aur publish karein."}
        </p>

        {/* Link Name Input */}
        <div className="mb-5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Page/Link Name</label>
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="e.g. My Summer Trip, client-name-pkg"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
            disabled={generated && !publishing}
          />
        </div>

        {/* What's included */}
        {!generated && (
          <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Will publish:
            </p>
            {[
              {
                icon: "🖼️",
                label: toolMode === "calendar"
                  ? "Layout: Standard Calendar View"
                  : `Layout: ${getLayoutById(pageData.activeLayout)?.config.name || "Default"}`,
              },
              { icon: "🎨", label: `Branding: ${pageData.branding?.value || "travsplatform"}` },
              { icon: "📦", label: `${(pageData.packages || []).length} Packages` },
              {
                icon: "📄",
                label: extraPages.length > 0
                  ? `${extraPages.length} Extra Pages: ${extraPages.map(p => PAGE_MAP[p] || p).join(", ")}`
                  : "No Extra Pages",
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <span>{icon}</span>
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Generated link */}
        {generated && (
          <div className="mb-5 space-y-3">
            {/* Main link */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Main Link</p>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8960C" strokeWidth="2" className="shrink-0">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
                <span className="text-sm text-gray-700 truncate flex-1 font-mono">{viewUrl}</span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: copied ? "#dcfce7" : "#E8960C", color: copied ? "#166534" : "#fff" }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Sub-pages links — only show if extra pages exist */}
            {extraPages.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Sub-Pages (automatically linked via Navbar)
                </p>
                <div className="space-y-1.5">
                  {extraPages.map((pId) => {
                    const subUrl = `${externalSiteUrl}/view/${currentPageId}?subPage=${pId}`;
                    return (
                      <div key={pId} className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
                        <span className="text-[10px] font-black text-orange-500 uppercase bg-orange-50 px-1.5 py-0.5 rounded shrink-0">
                          {PAGE_MAP[pId] || pId}
                        </span>
                        <span className="text-[11px] text-gray-400 truncate flex-1 font-mono">{subUrl}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(subUrl); }}
                          className="shrink-0 text-[10px] font-bold px-2 py-1 rounded bg-gray-200 hover:bg-orange-100 text-gray-600 transition-all"
                        >
                          Copy
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  ✅ In sab pages ka link Navbar mein automatically dikhta hai visitors ko.
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1">
              Clients ko sirf published version dikhega. Draft changes tab tak private rahenge jab tak dobara Publish nahi karte.
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!generated ? (
          <button
            onClick={handleGenerate}
            disabled={publishing || !pageName.trim()}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60"
            style={{ background: "#E8960C" }}
          >
            {publishing ? "Publishing…" : "🚀 Publish & Generate Link"}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => window.open(viewUrl, "_blank")}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Preview Live Page
            </button>
            <button
              onClick={handleGenerate}
              disabled={publishing}
              className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60 transition-all"
              style={{ background: "#E8960C" }}
            >
              {publishing ? "Publishing…" : "Re-publish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}