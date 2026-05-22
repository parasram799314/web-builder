// src/pages/AdminPage.jsx
// Website builder — left panel controls, right panel = live draft preview.
// "Layouts" tab shows layout cards. Clicking a layout loads it in preview.
// Themes tab removed, replaced by Layouts tab.

import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePageContext } from "../context/PageContext";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import Calendar from "../components/Calendar/Calendar";
import PackagesList from "../components/Packages/PackagesList";
import RightPanel from "../components/RightPanel/RightPanel";
import { BrandingSettings, ThemeSettings, GlobalActions } from "../components/Admin/AdminToolbar";
import GenerateLinkModal from "../components/Admin/GenerateLinkModal";
import MyLinksModal from "../components/Admin/MyLinksModal";
import InquiriesList from "../components/Admin/InquiriesList";
import PackageTableView from "../components/Packages/PackageTableView";
import Navbar from "../components/Navbar/Navbar";
import EmailBuilder from "../components/EmailBuilder/EmailBuilder";
import { EMAIL_CATEGORIES, EMAIL_TEMPLATES } from "../data/emailTemplates";
import { getAllLayouts, getLayoutById } from "../layouts/index";
import AboutPage from "../website-buildpage/AboutPage";
import BlogPage from "../website-buildpage/BlogPage";
import HelpPage from "../website-buildpage/HelpPage";
import ContactPage from "../website-buildpage/ContactPage";
import PrivacyPage from "../website-buildpage/PrivacyPage";
import TermsPage from "../website-buildpage/TermsPage";

const ALL_LAYOUTS = getAllLayouts();

// ── Email Template Sidebar (left panel content) ──────────────────────────────
function EmailTemplateSidebar({ onSelect, activeTemplateId }) {
  const [openCategory, setOpenCategory] = useState("booking");

  return (
    <div className="flex flex-col gap-2">
      {/* Header info */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Select Base</p>
        <p className="text-xs text-gray-600 font-medium">Click a category to see templates</p>
      </div>

      {EMAIL_CATEGORIES.map((cat) => {
        const isOpen = openCategory === cat.id;
        const catTemplates = EMAIL_TEMPLATES.filter(t => t.category === cat.id);

        return (
          <div key={cat.id} className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Accordion Trigger */}
            <button
              onClick={() => setOpenCategory(isOpen ? null : cat.id)}
              className={`flex items-center justify-between px-4 py-3 transition-all border-b ${
                isOpen 
                  ? "bg-white text-orange-600 border-orange-100" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-base transition-transform duration-300 ${isOpen ? "scale-110" : ""}`}>
                  {cat.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-tight">{cat.label}</span>
              </div>
              <svg 
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-orange-500" : "text-gray-400"}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Accordion Content (Templates) */}
            {isOpen && (
              <div className="p-2 flex flex-col gap-1.5 bg-gray-50/50">
                {catTemplates.map((template) => {
                  const isActive = activeTemplateId === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => onSelect(template)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border-2 text-left transition-all ${
                        isActive 
                          ? "bg-white border-orange-400 shadow-sm" 
                          : "bg-white border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
                           style={{ backgroundColor: template.color + "15" }}>
                        {template.thumbnail}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[11px] font-bold truncate ${isActive ? "text-orange-600" : "text-gray-800"}`}>
                          {template.name}
                        </p>
                        <p className="text-[9px] text-gray-400 truncate leading-tight">
                          Click to preview editor
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Layout Selector Panel (left sidebar content) ─────────────────────────────
function LayoutSelectorPanel({ onSelect }) {
  const { pageData, updateField } = usePageContext();
  const activeLayoutId = pageData?.activeLayout || null;
  const themeColor = pageData?.themeColor || "#E8960C";

  return (
    <div className="flex flex-col gap-4">
      {/* Info header */}
      <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm">
          <Icon name="layouts" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">Website Layouts</p>
          <p className="text-[10px] text-gray-500">Select a design for your platform</p>
        </div>
      </div>

      {/* Layout cards */}
      <div className="flex flex-col gap-4">
        {ALL_LAYOUTS.map(({ config, Preview }) => {
          const isActive = activeLayoutId === config.id;
          return (
            <button
              key={config.id}
              onClick={() => {
                updateField("activeLayout", config.id);
                if (onSelect) onSelect(config.id);
              }}
              className="w-full text-left rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
              style={{
                borderColor: isActive ? themeColor : "#e5e7eb",
                boxShadow: isActive ? `0 10px 20px -10px ${themeColor}60` : "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
              {/* Preview thumbnail */}
              <div className="w-full overflow-hidden relative" style={{ height: "140px" }}>
                <div className="absolute inset-0">
                  <Preview themeColor={themeColor} />
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow"
                    style={{ background: themeColor }}>
                    Active
                  </div>
                )}
              </div>
              {/* Info row */}
              <div className="px-4 py-3 bg-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">{config.name}</p>
                  <p className="text-[10px] text-gray-400 leading-snug">{config.description}</p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Coming soon placeholder */}
        <div className="rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50/60 flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-200 border border-gray-100">
            <Icon name="construction" className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">More layouts coming soon</p>
        </div>
      </div>
    </div>
  );
}

// ── Calendar Selector Panel (left sidebar content) ──────────────────────────
function CalendarSelectorPanel() {
  const { pageData, updateField } = usePageContext();
  const themeColor = pageData?.themeColor || "#E8960C";
  const activeTheme = pageData?.calendarTheme || "classic";

  const CALENDAR_TEMPLATES = [
    { id: "classic", label: "Classic", desc: "Clean & functional grid view", icon: "🗓️" },
    { id: "professional", label: "Professional", desc: "Modern dark premium look", icon: "🏢" },
    { id: "soft", label: "Soft", desc: "Elegant pastel rounded style", icon: "🍃" },
  ];

  const selectTheme = (id) => {
    updateField("calendarTheme", id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <span className="text-lg">🎨</span>
        <div>
          <p className="text-xs font-bold text-gray-700">Calendar Templates</p>
          <p className="text-[10px] text-gray-500">Choose a design for your holiday calendar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {CALENDAR_TEMPLATES.map((tpl) => {
          const isActive = activeTheme === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => selectTheme(tpl.id)}
              className="group relative flex flex-col rounded-2xl border-2 transition-all overflow-hidden bg-white hover:shadow-lg active:scale-[0.98]"
              style={{ borderColor: isActive ? themeColor : "#f1f5f9" }}
            >
              {/* Preview Indicator */}
              <div className={`h-24 w-full flex items-center justify-center text-3xl transition-all ${
                isActive ? "bg-opacity-10" : "bg-gray-50"
              }`} style={{ backgroundColor: isActive ? themeColor + "10" : "" }}>
                {tpl.icon}
                {isActive && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm" style={{ background: themeColor }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-4 border-t border-gray-50">
                <p className={`text-xs font-black uppercase tracking-tight ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                  {tpl.label} Template
                </p>
                <p className="text-[10px] text-gray-400 mt-1">{tpl.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── AI Chatbot Panel (left sidebar content) ─────────────────────────────
function AIChatbotPanel() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Travel Assistant. How can I help you build your website today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    setInput("");
    
    // Fake AI response
    setTimeout(() => {
      setMessages([...newMsgs, { role: "assistant", content: "I'm currently in 'UI Only' mode, but soon I'll be able to help you generate packages, themes, and content automatically!" }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
          <Icon name="ai" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">AI Assistant</p>
          <p className="text-[10px] text-gray-500">Ask me anything about your site</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${
              m.role === "user" 
                ? "bg-purple-600 text-white rounded-br-none" 
                : "bg-gray-100 text-gray-700 rounded-bl-none"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none text-xs focus:ring-0 px-2"
        />
        <button 
          onClick={handleSend}
          className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── Pages Selector Panel (left sidebar content) ─────────────────────────────
function PagesSelectorPanel({ onPageClick, activePreviewPage, toolMode = "website" }) {
  const { pageData, updateField, saveDraft } = usePageContext();
  const themeColor = pageData?.themeColor || "#E8960C";
  const extraPages = pageData?.extraPages || [];

  const PAGE_LIST = [
    { id: "about", label: "About Us", icon: "🏢", desc: "Share your company's story and mission" },
    { id: "blog", label: "Blog", icon: "✍️", desc: "Publish travel stories and updates" },
    { id: "help", label: "Help Center", icon: "🏥", desc: "Customer support and FAQs" },
    { id: "contact_page", label: "Contact", icon: "📞", desc: "Dedicated contact page" },
    { id: "privacy", label: "Privacy Policy", icon: "🔒", desc: "Legal privacy information" },
    { id: "terms", label: "Terms & Conditions", icon: "⚖️", desc: "Usage terms and legal stuff" },
  ];

  const togglePage = (e, id) => {
    e.stopPropagation();
    let newList;
    if (extraPages.includes(id)) {
      newList = extraPages.filter(item => item !== id);
    } else {
      newList = [...extraPages, id];
    }
    updateField("extraPages", newList);
    // FIX: Auto-save draft immediately after toggle so publish always
    // has the latest extraPages. We don't pass dataOverride anymore
    // because saveDraft now uses latest Ref state.
    setTimeout(() => {
      saveDraft(undefined, undefined, toolMode);
    }, 200);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
        <span className="text-lg">📄</span>
        <div>
          <p className="text-xs font-bold text-gray-700">Additional Pages</p>
          <p className="text-[10px] text-gray-500">Enable pages and click to preview</p>
        </div>
      </div>

      <button 
        onClick={() => onPageClick(null)}
        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
          !activePreviewPage ? "bg-white border-orange-400 shadow-md" : "bg-gray-50 border-transparent hover:border-gray-200"
        }`}
      >
        <span className="text-xl">🏠</span>
        <span className="text-xs font-bold uppercase text-gray-700">Main Landing Page</span>
      </button>

      <div className="flex flex-col gap-3">
        {PAGE_LIST.map((p) => {
          const isEnabled = extraPages.includes(p.id);
          const isPreviewing = activePreviewPage === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPageClick(p.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                isPreviewing ? "bg-white shadow-lg scale-[1.02]" : "bg-gray-50 opacity-70 border-transparent hover:border-gray-100"
              }`}
              style={{ borderColor: isPreviewing ? themeColor : "" }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                isEnabled ? "bg-green-50" : "bg-white shadow-sm"
              }`}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-black uppercase tracking-tight ${isPreviewing ? "text-gray-900" : "text-gray-400"}`}>
                  {p.label}
                </p>
                <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{p.desc}</p>
              </div>
              
              <div 
                onClick={(e) => togglePage(e, p.id)}
                className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                  isEnabled ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isEnabled ? "translate-x-4" : "translate-x-0"
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Widgets Selector Panel (left sidebar content) ──────────────────────────
function WidgetSelectorPanel() {
  const { pageData, updateField } = usePageContext();
  const themeColor = pageData?.themeColor || "#E8960C";

  const ALL_WIDGET_CONFIGS = [
    { id: "destinations", label: "Destinations", desc: "Trending locations grid", icon: "branding" },
    { id: "flights",      label: "Flights",      desc: "Search & book flights",    icon: "ai" }, // Reusing AI for flight-like feel or I'll add a specific flight path
    { id: "hotels",       label: "Hotels",       desc: "Luxury hotel stays",       icon: "layouts" },
    { id: "packages",     label: "Package List", desc: "Your smart travel packages", icon: "packages" },
    { id: "calendar",     label: "Holiday Calendar", desc: "Interactive holiday view", icon: "calendars" },
    { id: "contact",      label: "Contact Form", desc: "Lead generation form", icon: "contact" },
  ];

  // widgets stores the order of ALL widgets
  // We merge saved widgets with any new ones from ALL_WIDGET_CONFIGS
  const savedWidgets = pageData?.widgets || [];
  const configIds = ALL_WIDGET_CONFIGS.map(c => c.id);
  
  // Combine saved order with any missing widgets
  const orderedWidgets = [
    ...savedWidgets.filter(id => configIds.includes(id)),
    ...configIds.filter(id => !savedWidgets.includes(id))
  ];
  
  // hiddenWidgets stores IDs that are turned off
  const hiddenWidgets = pageData?.hiddenWidgets || [];

  const [draggedIndex, setDraggedIndex] = useState(null);

  const toggleVisibility = (id) => {
    let newList;
    if (hiddenWidgets.includes(id)) {
      newList = hiddenWidgets.filter(item => item !== id);
    } else {
      newList = [...hiddenWidgets, id];
    }
    updateField("hiddenWidgets", newList);
  };

  const moveWidget = (fromIndex, toIndex) => {
    const newList = [...orderedWidgets];
    const item = newList.splice(fromIndex, 1)[0];
    newList.splice(toIndex, 0, item);
    updateField("widgets", newList);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    moveWidget(draggedIndex, index);
    setDraggedIndex(index);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
          <Icon name="widgets" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-700 uppercase tracking-widest">Page Structure</p>
          <p className="text-[10px] text-gray-500">Drag to reorder • Toggle eye to hide</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {orderedWidgets.map((id, index) => {
          const config = ALL_WIDGET_CONFIGS.find(w => w.id === id);
          if (!config) return null;
          const isHidden = hiddenWidgets.includes(id);
          
          return (
            <div 
              key={id} 
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={() => setDraggedIndex(null)}
              className={`group bg-white rounded-2xl border-2 p-3 shadow-sm transition-all flex items-center gap-3 cursor-move ${
                draggedIndex === index ? "opacity-40 scale-95 border-orange-400" : "hover:shadow-md border-gray-100 hover:border-orange-100"
              } ${isHidden ? "bg-gray-50/50" : ""}`}
            >
              {/* Drag Handle Icon */}
              <div className="text-gray-300 group-hover:text-orange-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                   <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                   <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                </svg>
              </div>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isHidden ? "bg-gray-100 grayscale text-gray-400" : "bg-orange-50 text-orange-600"
              }`}>
                <Icon name={config.icon} className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-black uppercase tracking-tight ${isHidden ? "text-gray-400" : "text-gray-900"}`}>
                  {config.label}
                </p>
                <p className="text-[9px] text-gray-400 truncate leading-tight">{config.desc}</p>
              </div>

              {/* Visibility Toggle */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleVisibility(id); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isHidden ? "bg-gray-200 text-gray-400" : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                }`}
                title={isHidden ? "Show widget" : "Hide widget"}
              >
                {isHidden ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.47 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <p className="text-[9px] text-gray-400 text-center font-medium">
        💡 Tip: Blue eye means section is visible on your site.
      </p>
    </div>
  );
}

// ── Professional Icons ────────────────────────────────────────────────────────
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    branding: (
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    ),
    destinations: (
      <>
        <circle cx="12" cy="10" r="3" />
        <path d="M22 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10z" />
        <path d="M12 2v4" />
        <path d="M12 14v6" />
        <path d="M2 10h4" />
        <path d="M14 10h8" />
      </>
    ),
    flights: (
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.2-2.1.5-2.4 1.5l-.3.9L10 12.3l-3.7 3.7-2.3-.7-1 1 2.8 2.8 2.8 2.8 1-1-.7-2.3 3.7-3.7 3.2 7.4.9-.3c1-.3 1.7-1.3 1.5-2.4z" />
    ),
    hotels: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
        <path d="M9 11h6" />
        <path d="M9 15h6" />
        <path d="M11 5V3a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v2" />
      </>
    ),
    layouts: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    packages: (
      <>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
    calendars: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    contact: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    widgets: (
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
        <polyline points="7.5 19.79 7.5 14.6 3 12" />
        <polyline points="21 12 16.5 14.6 16.5 19.79" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
    pages: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),
    inquiries: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </>
    ),
    templates: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="9" x2="9" y2="21" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M8 10h.01" />
        <path d="M16 10h.01" />
        <path d="M8 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M16 18h.01" />
      </>
    ),
    edit: (
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.09 9.81a19.79 19.79 0 0 1-3.07-8.66A2 2 0 0 1 2 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    scale: (
      <>
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h18" />
      </>
    ),
    home: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    ai: (
      <>
        <path d="M12 8V4H8" />
        <rect x="2" y="8" width="20" height="12" rx="2" />
        <circle cx="7" cy="14" r="2" />
        <circle cx="17" cy="14" r="2" />
        <path d="M12 14h.01" />
      </>
    ),
    construction: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        <path d="M7 18v2" />
        <path d="M17 18v2" />
      </>
    )
  };

  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {icons[name] || icons.branding}
    </svg>
  );
};

// ── Main AdminPage ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { loadingPage, pageData, updateField, createNewPage, currentPageId, fetchAllPages } = usePageContext();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const toolMode = queryParams.get("tool") || "website"; // 'website', 'calendar', or 'email'

  // Ref to track the last tool mode to detect changes
  const lastToolMode = useRef(null);

  // Initialize/Reset editor when tool mode changes
  React.useEffect(() => {
    // Only run if the toolMode has actually changed from what we last saw
    if (lastToolMode.current !== toolMode) {
      console.log("Tool mode changed or initial load:", toolMode);
      if (toolMode !== "email") {
        createNewPage();
        fetchAllPages(toolMode);
      }
      lastToolMode.current = toolMode;
    }
  }, [toolMode, createNewPage, fetchAllPages]);

  // Sync missing widgets into pageData
  React.useEffect(() => {
    if (pageData && toolMode === "website") {
      const ALL_CONFIG_IDS = ["destinations", "flights", "hotels", "packages", "calendar", "contact"];
      const currentWidgets = pageData.widgets || [];
      const missing = ALL_CONFIG_IDS.filter(id => !currentWidgets.includes(id));
      
      if (missing.length > 0) {
        console.log("Auto-syncing missing widgets:", missing);
        updateField("widgets", [...currentWidgets, ...missing]);
      }
    }
  }, [pageData?.widgets, toolMode, updateField]);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showMyLinks, setShowMyLinks] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [activeTab, setActiveTab] = useState(toolMode === "email" ? "templates" : "branding");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
  const [previewSubPage, setPreviewSubPage] = useState(null); // 'landing' or 'about', etc.
  const [aiMode, setAiMode] = useState(false);

  if (loadingPage && toolMode !== "email") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your dashboard…</p>
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
      {/* Top Navbar */}
      <AdminNavbar
        toolMode={toolMode}
        onGenerateLink={() => setShowLinkModal(true)}
        onViewTable={() => setShowTableView(true)}
        onShowMyLinks={() => setShowMyLinks(true)}
      />

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
                  }}
                  className={`flex flex-col items-center gap-1 group transition-all ${
                    isActive ? "scale-105" : "text-gray-400 hover:text-gray-600"
                  }`}
                  style={{ color: isActive ? themeColor : "" }}
                >
                  <div 
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 ${
                      isActive 
                        ? "shadow-md text-white" 
                        : "bg-white group-hover:bg-gray-100 border border-gray-50"
                    }`}
                    style={{ background: isActive ? themeColor : "" }}
                  >
                    <Icon name={tab.icon} className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-tighter text-center px-1 ${isActive ? "opacity-100" : "opacity-60"}`}>
                    {tab.label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 flex flex-col min-w-[300px] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">
                  {TABS.find((t) => t.id === activeTab)?.label}
                </span>
              </div>
              <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                DRAFT
              </span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-5">
              {aiMode ? (
                <AIChatbotPanel />
              ) : (
                <>
                  {activeTab === "branding" && (
                    <div className="flex flex-col gap-8">
                      <BrandingSettings />
                      <div className="border-t border-gray-100" />
                      <ThemeSettings />
                    </div>
                  )}
                  {activeTab === "layouts" && (
                    <LayoutSelectorPanel
                      onSelect={(id) => {
                        // Just update field, preview auto-reflects
                      }}
                    />
                  )}
                  {activeTab === "templates" && (
                    <EmailTemplateSidebar 
                      activeTemplateId={selectedEmailTemplate?.id}
                      onSelect={(template) => setSelectedEmailTemplate(template)}
                    />
                  )}
                  {activeTab === "settings" && (
                    <div className="flex flex-col gap-4">
                      <RightPanel isAdmin={true} part="top" />
                    </div>
                  )}
                  {activeTab === "packages" && (
                    <div className="flex flex-col gap-4">
                      <PackagesList isAdmin={true} isSidebar={true} />
                    </div>
                  )}
                  {activeTab === "calendars" && <CalendarSelectorPanel />}
                  {activeTab === "widgets" && <WidgetSelectorPanel />}
                  {activeTab === "pages" && (
                    <PagesSelectorPanel 
                      onPageClick={(id) => setPreviewSubPage(id)} 
                      activePreviewPage={previewSubPage}
                      toolMode={toolMode}
                    />
                  )}
                  {activeTab === "contact" && (
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                        <div>
                          <p className="text-xs font-bold text-gray-700">Display Form</p>
                          <p className="text-[10px] text-gray-500">Enable/Disable contact form</p>
                        </div>
                        <button
                          onClick={() => updateField("showContactForm", !pageData.showContactForm)}
                          className="relative w-10 h-5 rounded-full transition-colors duration-300"
                          style={{ background: pageData.showContactForm ? themeColor : "#d1d5db" }}
                        >
                          <span
                            className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all duration-300"
                            style={{ transform: pageData.showContactForm ? "translateX(20px)" : "translateX(0px)" }}
                          />
                        </button>
                      </div>
                      <RightPanel isAdmin={true} part="bottom" />
                    </div>
                  )}
                  {activeTab === "inquiries" && <InquiriesList />}
                </>
              )}
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-100">
              <GlobalActions toolMode={toolMode} />
            </div>
          </div>
        </aside>

        {/* ─── RIGHT PANEL: PREVIEW ──────────────────────────────────────── */}
        <section className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-300 relative">

          {/* Expand button when sidebar collapsed */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="absolute top-4 left-4 z-50 w-10 h-10 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-all hover:scale-110 active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Preview toolbar */}
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-3 shrink-0">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400 font-mono truncate">
              yoursite.com/view/...&nbsp;
              <span className="text-amber-400 font-semibold">(Draft Preview)</span>
            </div>
            <div className="flex bg-gray-700 rounded-lg p-0.5 gap-0.5 shrink-0">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  previewMode === "desktop" ? "bg-gray-500 text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                🖥 <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  previewMode === "mobile" ? "bg-gray-500 text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                📱 <span>Mobile</span>
              </button>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0 hidden lg:block">
              Changes yahan dikhenge — Publish karo live ke liye
            </span>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-auto bg-gray-300 flex items-start justify-center p-4">

            {previewMode === "desktop" ? (
              <div
                className="w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-400 flex flex-col"
                style={{ minHeight: "500px" }}
              >
                {/* If a layout is selected, show that layout */}
                {toolMode === "email" ? (
                   <EmailBuilder 
                    selectedTemplate={selectedEmailTemplate} 
                    setSelectedTemplate={setSelectedEmailTemplate} 
                    userPackages={pageData?.packages || []}
                   />
                ) : previewSubPage ? (
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
                              <Calendar selectedCountries={pageData?.countries || ["india"]} isAdmin={false} />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-3">
                              <PackagesList isAdmin={false} packages={pageData?.packages || []} />
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
                        <EmailBuilder 
                          selectedTemplate={selectedEmailTemplate} 
                          setSelectedTemplate={setSelectedEmailTemplate} 
                        />
                      ) : previewSubPage ? (
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
                        <>
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
                        </>
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