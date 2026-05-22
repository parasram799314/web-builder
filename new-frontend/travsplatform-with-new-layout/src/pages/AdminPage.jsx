// src/pages/AdminPage.jsx
// Website builder — left panel controls, right panel = live draft preview.
// "Layouts" tab shows layout cards. Clicking a layout loads it in preview.
// Themes tab removed, replaced by Layouts tab.

import React, { useState, useRef, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { usePageContext } from "../context/PageContext";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import RightPanel from "../components/RightPanel/RightPanel";
import { BrandingSettings, ThemeSettings, GlobalActions } from "../components/Admin/AdminToolbar";
import GenerateLinkModal from "../components/Admin/GenerateLinkModal";
import MyLinksModal from "../components/Admin/MyLinksModal";
import InquiriesList from "../components/Admin/InquiriesList";
import PackageTableView from "../components/Packages/PackageTableView";
import Navbar from "../components/Navbar/Navbar";
import { EMAIL_CATEGORIES, EMAIL_TEMPLATES } from "../data/emailTemplates";
import { getAllLayouts, getLayoutById } from "../layouts/index";

// Lazy Load Heavy Components
const Calendar = lazy(() => import("../components/Calendar/Calendar"));
const PackagesList = lazy(() => import("../components/Packages/PackagesList"));
const EmailBuilder = lazy(() => import("../components/EmailBuilder/EmailBuilder"));

// Lazy Load Build Pages
const AboutPage = lazy(() => import("../website-buildpage/AboutPage"));
const BlogPage = lazy(() => import("../website-buildpage/BlogPage"));
const HelpPage = lazy(() => import("../website-buildpage/HelpPage"));
const ContactPage = lazy(() => import("../website-buildpage/ContactPage"));
const PrivacyPage = lazy(() => import("../website-buildpage/PrivacyPage"));
const TermsPage = lazy(() => import("../website-buildpage/TermsPage"));

const ALL_LAYOUTS = getAllLayouts();

const PreviewLoading = () => (
  <div className="flex-1 flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Loading Preview...</p>
    </div>
  </div>
);

// ── Email Template Sidebar (left panel content) ──────────────────────────────
function EmailTemplateSidebar({ onSelect, activeTemplateId }) {
  const [openCategory, setOpenCategory] = useState("booking");

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1">Email Builder</h3>
        <p className="text-xs text-gray-500 font-medium">Select a template to customize</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        {EMAIL_CATEGORIES.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <button
              onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 px-2 transition-colors"
            >
              {cat.label}
              <svg 
                className={`w-3 h-3 transition-transform ${openCategory === cat.id ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openCategory === cat.id && (
              <div className="grid grid-cols-1 gap-2 pl-1">
                {EMAIL_TEMPLATES.filter(t => t.category === cat.id).map(template => (
                  <button
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className={`group relative flex flex-col p-3 rounded-xl border transition-all duration-300 ${
                      activeTemplateId === template.id
                        ? "bg-orange-50 border-orange-200 shadow-sm"
                        : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        activeTemplateId === template.id ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                      }`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className={`text-xs font-bold leading-tight ${activeTemplateId === template.id ? "text-orange-900" : "text-gray-900"}`}>
                          {template.name}
                        </div>
                        <div className="text-[9px] text-gray-400 font-medium mt-0.5 uppercase tracking-tighter">
                          Ready to ship
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Generic Icon Component ───────────────────────────────────────────────────
function Icon({ name, className }) {
  const icons = {
    ai: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    branding: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    themes: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    layouts: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    packages: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    calendars: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    contact: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    widgets: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" />
      </svg>
    ),
    pages: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    inquiries: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    templates: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    )
  };
  return icons[name] || null;
}

// ── AI Floating Controls ─────────────────────────────────────────────────────
function AiControls({ aiMode, themeColor }) {
  if (!aiMode) return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 shadow-sm">
        <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
          AI Smart Actions
        </h4>
        <div className="space-y-2">
          {[
            { label: "Improve Writing", icon: "✨" },
            { label: "Generate Packages", icon: "📦" },
            { label: "Design Ideas", icon: "🎨" },
          ].map((action) => (
            <button
              key={action.label}
              className="w-full flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <span className="text-xs font-bold text-gray-700">{action.label}</span>
              <span className="text-sm group-hover:scale-125 transition-transform">{action.icon}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
          "Try asking me to rewrite your hero section or create a 5-day itinerary for Bali."
        </p>
      </div>
    </div>
  );
}

// ── Component Previews ───────────────────────────────────────────────────────
function LayoutCard({ layout, isActive, onSelect, themeColor }) {
  return (
    <div
      onClick={() => onSelect(layout.config.id)}
      className={`group cursor-pointer relative rounded-2xl border-2 transition-all duration-300 overflow-hidden h-48 ${
        isActive
          ? "border-orange-500 shadow-lg scale-[1.02]"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="h-full w-full bg-gray-50 flex items-center justify-center p-2">
        {layout.Preview ? <layout.Preview themeColor={themeColor} /> : <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Preview</div>}
      </div>
      <div className={`absolute inset-x-0 bottom-0 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 transition-all ${
        isActive ? "translate-y-0" : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{layout.config.name}</span>
          {isActive && (
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Widget List Toggle ───────────────────────────────────────────────────────
function WidgetToggle({ id, label, isHidden, onToggle }) {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 ${
        isHidden
          ? "bg-gray-50 border-gray-100 opacity-60"
          : "bg-white border-orange-100 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isHidden ? "bg-gray-200 text-gray-400" : "bg-orange-500 text-white"}`}>
          <Icon name="widgets" className="w-4 h-4" />
        </div>
        <span className={`text-xs font-bold ${isHidden ? "text-gray-400" : "text-gray-900"}`}>{label}</span>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isHidden ? "bg-gray-300" : "bg-orange-500"}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isHidden ? "left-1" : "left-6"}`} />
      </div>
    </button>
  );
}

// ── Extra Pages Manager ──────────────────────────────────────────────────────
function ExtraPagesManager({ extraPages = [], onToggle, themeColor }) {
  const PAGES = [
    { id: 'about', label: 'About Us', icon: '👤' },
    { id: 'blog', label: 'Travel Blog', icon: '✍️' },
    { id: 'help', label: 'Help Center', icon: '❓' },
    { id: 'contact_page', label: 'Contact Us', icon: '📞' },
    { id: 'privacy', label: 'Privacy Policy', icon: '⚖️' },
    { id: 'terms', label: 'Terms & Conditions', icon: '📝' },
  ];

  return (
    <div className="space-y-3">
      {PAGES.map(page => {
        const isEnabled = extraPages.includes(page.id);
        return (
          <button
            key={page.id}
            onClick={() => onToggle(page.id)}
            className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 ${
              !isEnabled
                ? "bg-gray-50 border-gray-100 opacity-60"
                : "bg-white border-orange-100 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${!isEnabled ? "bg-gray-200" : "bg-orange-50"}`}>
                {page.icon}
              </div>
              <div className="text-left">
                <span className={`text-xs font-bold block ${!isEnabled ? "text-gray-400" : "text-gray-900"}`}>{page.label}</span>
                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Standalone Page</span>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${!isEnabled ? "bg-gray-300" : "bg-orange-500"}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${!isEnabled ? "left-1" : "left-6"}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function AdminPage() {
  const { pageData, updateField, loadingPage, backendWakingUp, currentPageId, saving } = usePageContext();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get("tool") || "website";

  const [toolMode, setToolMode] = useState(initialMode); // 'website', 'calendar', 'email'
  const [activeTab, setActiveTab] = useState(initialMode === "email" ? "templates" : "branding");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewDevice, setViewDevice] = useState("desktop"); // 'desktop' or 'mobile'
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [showMyLinks, setShowMyLinks] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
  const [previewSubPage, setPreviewSubPage] = useState(null); // 'landing' or 'about', etc.
  const [aiMode, setAiMode] = useState(false);

  if (loadingPage && toolMode !== "email") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 max-w-sm w-full mx-4">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-2">
            {backendWakingUp ? "Server is waking up..." : "Loading Dashboard"}
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            {backendWakingUp 
              ? "We're starting up our engine. Since you're on the free tier, this might take 30-60 seconds on the first load." 
              : "Preparing your workspace and syncing your latest travel data."}
          </p>
        </div>
      </div>
    );
  }

  // Determine which layout is active
  const activeLayoutId = pageData?.activeLayout || null;
  const activeLayout = activeLayoutId ? getLayoutById(activeLayoutId) : null;

  // If calendar or email mode, we ignore the selected layout and show the default 3-panel or builder
  const ActiveLayoutComponent = (toolMode === "calendar" || toolMode === "email") ? null : (activeLayout?.Layout || null);

  const themeColor = pageData?.themeColor || "#E8960C";

  let TABS = [
    { id: "branding",  label: "Branding",     icon: "branding" },
    { id: "layouts",   label: "Layouts",       icon: "layouts" },
    { id: "settings",  label: "Settings",      icon: "settings" },
    { id: "packages",  label: "Packages",      icon: "packages" },
    { id: "calendars", label: "Calendars",     icon: "calendars" },
    { id: "contact",   label: "Contact",       icon: "contact" },
    { id: "widgets",   label: "Sections",      icon: "widgets" },
    { id: "pages",     label: "Pages",         icon: "pages" },
    { id: "inquiries", label: "Inquiries",     icon: "inquiries" },
  ];

  // Adjust tabs based on tool mode
  if (toolMode === "calendar") {
    TABS = TABS.filter(tab => tab.id !== "layouts");
  } else if (toolMode === "email") {
    TABS = [
      { id: "templates", label: "Templates",   icon: "templates" },
      { id: "branding",  label: "Design",      icon: "branding" },
      { id: "settings",  label: "Settings",    icon: "settings" },
    ];
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Main layout */}
      <main className="flex-1 flex overflow-hidden">

        {/* ── TABLE VIEW PAGE ───────────────────────────────────────────── */}
        {showTableView ? (
          <div className="flex-1 overflow-hidden">
            <PackageTableView onBack={() => setShowTableView(false)} />
          </div>
        ) : (
        <>
        {/* ─── LEFT PANEL ────────────────────────────────────────────────── */}
        <aside
          className="border-r border-gray-200 flex bg-white overflow-hidden shadow-sm transition-all duration-300 ease-in-out"
          style={{ width: isCollapsed ? "80px" : "380px" }}
        >
          {/* Icon rail */}
          <div className="w-20 border-r border-gray-100 flex flex-col items-center py-6 gap-5 bg-gray-50/50 shrink-0 overflow-y-auto no-scrollbar">
            {/* AI Tool Button */}
            <button
              onClick={() => {
                setAiMode(!aiMode);
                if (isCollapsed) setIsCollapsed(false);
              }}
              className={`flex flex-col items-center gap-1 group transition-all mb-2 ${
                aiMode ? "text-purple-600 scale-105" : "text-gray-400 hover:text-purple-500"
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                aiMode
                  ? "bg-purple-600 text-white shadow-purple-200"
                  : "bg-white group-hover:bg-purple-50 border border-gray-100"
              }`}>
                <Icon name="ai" className="w-6 h-6" />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter text-center px-1 ${aiMode ? "text-purple-700" : ""}`}>
                AI Agent
              </span>
            </button>

            <div className="w-10 h-px bg-gray-200/60" />

            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (isCollapsed) setIsCollapsed(false);
                    setAiMode(false);
                  }}
                  className={`flex flex-col items-center gap-1 group transition-all ${
                    isActive ? "text-orange-600 scale-105" : "text-gray-400 hover:text-orange-400"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-100"
                      : "bg-white group-hover:bg-orange-50 border border-gray-100"
                  }`}>
                    <Icon name={tab.icon} className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-tighter text-center px-1 ${isActive ? "text-orange-700" : ""}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isCollapsed && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-7">
                {aiMode ? (
                  <AiControls aiMode={aiMode} themeColor={themeColor} />
                ) : (
                  <>
                    {activeTab === "templates" && toolMode === "email" && (
                      <EmailTemplateSidebar 
                        activeTemplateId={selectedEmailTemplate?.id}
                        onSelect={(t) => setSelectedEmailTemplate(t)} 
                      />
                    )}

                    {activeTab === "branding" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Identity</h3>
                          <p className="text-xs text-gray-500 font-medium">Define how your brand looks and feels.</p>
                        </div>
                        <BrandingSettings 
                          branding={pageData?.branding} 
                          onUpdate={(val) => updateField("branding", val)} 
                        />
                        <div className="pt-4 border-t border-gray-100">
                          <ThemeSettings 
                            themeColor={themeColor} 
                            onUpdate={(val) => updateField("themeColor", val)} 
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === "layouts" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Design System</h3>
                          <p className="text-xs text-gray-500 font-medium">Choose a layout that matches your agency's style.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {ALL_LAYOUTS.map((layout) => (
                            <LayoutCard
                              key={layout.config.id}
                              layout={layout}
                              themeColor={themeColor}
                              isActive={pageData?.activeLayout === layout.config.id}
                              onSelect={(id) => {
                                updateField("activeLayout", id);
                                setPreviewSubPage(null); // Return to landing on layout change
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "settings" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Global Config</h3>
                          <p className="text-xs text-gray-500 font-medium">Control primary settings for your {toolMode}.</p>
                        </div>
                        <GlobalActions 
                          showContactForm={pageData?.showContactForm !== false}
                          onUpdateContactForm={(val) => updateField("showContactForm", val)}
                          fontFamily={pageData?.fontFamily || "'Space Grotesk', sans-serif"}
                          onUpdateFont={(val) => updateField("fontFamily", val)}
                        />
                      </div>
                    )}

                    {activeTab === "packages" && (
                      <div className="space-y-8">
                         <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Inventory</h3>
                          <p className="text-xs text-gray-500 font-medium">Create and manage your holiday packages.</p>
                        </div>
                        <Suspense fallback={<div className="p-12 text-center animate-pulse text-gray-400 font-bold uppercase text-[10px]">Loading Inventory...</div>}>
                          <PackagesList isAdmin={true} packages={pageData?.packages || []} />
                        </Suspense>
                      </div>
                    )}

                    {activeTab === "calendars" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Availability</h3>
                          <p className="text-xs text-gray-500 font-medium">Manage destinations and regional calendars.</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Target Regions</p>
                           <RightPanel isAdmin={true} part="top" countries={pageData?.countries || ["india"]} />
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Live Calendar Editor</p>
                           <Suspense fallback={<div className="p-12 text-center animate-pulse text-gray-400 font-bold uppercase text-[10px]">Loading Calendar Engine...</div>}>
                             <Calendar selectedCountries={pageData?.countries || ["india"]} isAdmin={true} />
                           </Suspense>
                        </div>
                      </div>
                    )}

                    {activeTab === "contact" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Lead Capture</h3>
                          <p className="text-xs text-gray-500 font-medium">Customize how clients reach out to you.</p>
                        </div>
                        <RightPanel isAdmin={true} part="bottom" countries={pageData?.countries || ["india"]} showContactForm={pageData?.showContactForm !== false} />
                      </div>
                    )}

                    {activeTab === "widgets" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Section Controls</h3>
                          <p className="text-xs text-gray-500 font-medium">Toggle visibility of specific site sections.</p>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: 'hero', label: 'Hero / Banner' },
                            { id: 'marquee', label: 'Status Marquee' },
                            { id: 'calendar', label: 'Holiday Planner' },
                            { id: 'packages', label: 'Package Grid' },
                            { id: 'hotels', label: 'Stays / Hotels' },
                            { id: 'cta', label: 'Newsletter / CTA' },
                            { id: 'contact', label: 'Inquiry Form' },
                          ].map(w => (
                            <WidgetToggle
                              key={w.id}
                              id={w.id}
                              label={w.label}
                              isHidden={(pageData?.hiddenWidgets || []).includes(w.id)}
                              onToggle={(id) => {
                                const current = pageData?.hiddenWidgets || [];
                                const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
                                updateField("hiddenWidgets", next);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "pages" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Subpages</h3>
                          <p className="text-xs text-gray-500 font-medium">Enable standalone pages for your site.</p>
                        </div>
                        <ExtraPagesManager 
                          extraPages={pageData?.extraPages || []}
                          themeColor={themeColor}
                          onToggle={(id) => {
                             const current = pageData?.extraPages || [];
                             const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
                             updateField("extraPages", next);
                          }}
                        />
                      </div>
                    )}

                    {activeTab === "inquiries" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Lead Inbox</h3>
                          <p className="text-xs text-gray-500 font-medium">Monitor your incoming leads and inquiries.</p>
                        </div>
                        <InquiriesList />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-12 border-t border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all shrink-0"
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ─── RIGHT PANEL (LIVE PREVIEW) ─────────────────────────────────── */}
        <section className="flex-1 flex flex-col bg-gray-100 relative overflow-hidden">
          {/* Tool mode indicators */}
          <div className="absolute top-6 left-6 z-30 flex items-center gap-2">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="flex p-0.5 bg-gray-100 rounded-xl">
                 <button 
                  onClick={() => setViewDevice('desktop')}
                  className={`p-1.5 rounded-lg transition-all ${viewDevice === 'desktop' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                 </button>
                 <button 
                  onClick={() => setViewDevice('mobile')}
                  className={`p-1.5 rounded-lg transition-all ${viewDevice === 'mobile' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
                 </button>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${saving ? "bg-orange-400 animate-pulse" : "bg-green-500"}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {saving ? "Auto-saving..." : "Changes Live"}
                </span>
              </div>
            </div>

            {previewSubPage && (
              <button 
                onClick={() => setPreviewSubPage(null)}
                className="bg-gray-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-gray-800 transition-all"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
                Return to Landing
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-12 overflow-hidden">
            {viewDevice === "desktop" ? (
              /* Desktop browser frame */
              <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
                <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-200" />
                    <div className="w-3 h-3 rounded-full bg-yellow-200" />
                    <div className="w-3 h-3 rounded-full bg-green-200" />
                  </div>
                  <div className="mx-auto bg-white border border-gray-200 rounded-lg h-6 px-4 flex items-center gap-2 min-w-[300px]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span className="text-[10px] text-gray-400 font-medium truncate">your-travel-site.travsplatform.com/{previewSubPage || ""}</span>
                  </div>
                </div>
                
                {/* If a layout is selected, show that layout */}
                {toolMode === "email" ? (
                   <Suspense fallback={<PreviewLoading />}>
                     <EmailBuilder 
                      selectedTemplate={selectedEmailTemplate} 
                      setSelectedTemplate={setSelectedEmailTemplate} 
                      userPackages={pageData?.packages || []}
                     />
                   </Suspense>
                ) : (
                  <Suspense fallback={<PreviewLoading />}>
                    {previewSubPage ? (
                      <div className="flex-1 overflow-auto">
                          {previewSubPage === 'about' && <AboutPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                          {previewSubPage === 'blog' && <BlogPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                          {previewSubPage === 'help' && <HelpPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                          {previewSubPage === 'contact_page' && <ContactPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                          {previewSubPage === 'privacy' && <PrivacyPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                          {previewSubPage === 'terms' && <TermsPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                      </div>
                    ) : ActiveLayoutComponent ? (
                      <div className="flex-1 overflow-hidden">
                        <ActiveLayoutComponent
                          draftData={pageData}
                          agentId={currentPageId || pageData?.userId}
                          isAdmin={true}
                          updateField={updateField}
                          onPageClick={(id) => setPreviewSubPage(id)}
                        />
                      </div>
                    ) : (
                      /* Default: original 3-panel layout */
                      <>
                        <Navbar 
                          branding={pageData?.branding} 
                          themeColor={pageData?.themeColor} 
                          extraPages={pageData?.extraPages} 
                          pageId={currentPageId || pageData?.userId}
                          isAdmin={true}
                          onPageClick={(id) => setPreviewSubPage(id)}
                        />
                        <div className="flex-1 flex overflow-hidden bg-gray-50">
                          {/* Left sidebar only shown if NOT in calendar mode */}
                          {toolMode !== "calendar" && (
                            <aside className="w-52 border-r border-gray-200 flex flex-col bg-white p-3 gap-3 overflow-y-auto custom-scrollbar shrink-0">
                              <RightPanel isAdmin={false} part="top" countries={pageData?.countries || ["india"]} />
                            </aside>
                          )}
                          
                          <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 bg-gray-100 min-w-0">
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                              <div className="flex flex-col gap-3">
                                <div className="bg-white rounded-2xl shadow-sm p-3">
                                  <Suspense fallback={<div className="h-40 flex items-center justify-center animate-pulse text-[10px] font-bold text-gray-400">Loading Calendar...</div>}>
                                    <Calendar selectedCountries={pageData?.countries || ["india"]} isAdmin={false} />
                                  </Suspense>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm p-3">
                                  <Suspense fallback={<div className="h-40 flex items-center justify-center animate-pulse text-[10px] font-bold text-gray-400">Loading Packages...</div>}>
                                    <PackagesList isAdmin={false} packages={pageData?.packages || []} />
                                  </Suspense>
                                </div>
                              </div>
                            </div>
                          </div>
                          <aside className="w-56 flex flex-col bg-white p-3 overflow-y-auto custom-scrollbar shrink-0">
                            <RightPanel isAdmin={false} part="bottom" countries={pageData?.countries || ["india"]} showContactForm={pageData?.showContactForm !== false} />
                          </aside>
                        </div>
                      </>
                    )}
                  </Suspense>
                )}
              </div>
            ) : (
              /* Mobile phone frame */
              <div className="flex flex-col items-center">
                <div className="bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-gray-700" style={{ width: "380px" }}>
                  <div className="flex justify-center mb-1">
                    <div className="w-20 h-5 bg-gray-800 rounded-full" />
                  </div>
                  <div className="rounded-[1.8rem] overflow-hidden bg-white" style={{ height: "680px" }}>
                    <div className="h-full overflow-y-auto">
                      {toolMode === "email" ? (
                        <Suspense fallback={<PreviewLoading />}>
                          <EmailBuilder 
                            selectedTemplate={selectedEmailTemplate} 
                            setSelectedTemplate={setSelectedEmailTemplate} 
                          />
                        </Suspense>
                      ) : (
                        <Suspense fallback={<PreviewLoading />}>
                          {previewSubPage ? (
                            <div className="h-full overflow-auto bg-white">
                              {previewSubPage === 'about' && <AboutPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                              {previewSubPage === 'blog' && <BlogPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                              {previewSubPage === 'help' && <HelpPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                              {previewSubPage === 'contact_page' && <ContactPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                              {previewSubPage === 'privacy' && <PrivacyPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                              {previewSubPage === 'terms' && <TermsPage pageData={pageData} isAdmin={true} onPageClick={(id) => setPreviewSubPage(id)} />}
                            </div>
                          ) : ActiveLayoutComponent ? (
                            <ActiveLayoutComponent 
                              draftData={pageData} 
                              agentId={pageData?.userId} 
                              isAdmin={true}
                              updateField={updateField}
                            />
                          ) : (
                            <Suspense fallback={<PreviewLoading />}>
                              <Navbar branding={pageData?.branding} themeColor={pageData?.themeColor} />
                              <div className="flex flex-col gap-2 p-2">
                                <div className="bg-white rounded-xl shadow-sm p-2">
                                  <Calendar selectedCountries={pageData?.countries || ["india"]} isAdmin={false} />
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-2">
                                  <PackagesList isAdmin={false} packages={pageData?.packages || []} />
                                </div>
                                {/* Always show contact form in mobile preview if enabled */}
                                <div className="bg-white rounded-xl shadow-sm p-2">
                                  <RightPanel isAdmin={false} part="bottom" countries={pageData?.countries || ["india"]} showContactForm={pageData?.showContactForm !== false} />
                                </div>
                              </div>
                            </Suspense>
                          )}
                        </Suspense>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="w-24 h-1.5 bg-gray-600 rounded-full" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 font-medium">Mobile Preview</p>
              </div>
            )}
          </div>
        </section>
        </> )} {/* end of !showTableView ternary */}
      </main>

      {showLinkModal && (
        <GenerateLinkModal 
          toolMode={toolMode} 
          onClose={() => setShowLinkModal(false)} 
        />
      )}

      {showMyLinks && (
        <MyLinksModal 
          toolMode={toolMode} 
          onClose={() => setShowMyLinks(false)} 
        />
      )}

    </div>
  );
}
