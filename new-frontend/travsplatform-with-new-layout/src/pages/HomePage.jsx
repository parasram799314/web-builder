import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const tools = [
    {
      id: "website-builder",
      title: "Website Builder",
      description: "Design and ship a high-converting travel website...",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      path: "/admin?tool=website",
      status: "Active",
      popular: false,
    },
    {
      id: "calendar-builder",
      title: "Calendar Builder",
      description: "Build custom availability calendars and sync them...",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      path: "/admin?tool=calendar",
      status: "Active",
      popular: true,
    },
    {
      id: "email-template-builder",
      title: "Email Templates",
      description: "Craft branded transactional and marketing emails for your...",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      path: "/admin?tool=email",
      status: "Active",
      popular: false,
    },
    {
      id: "other",
      title: "More Tools",
      description: "Workflows, integrations and automations — coming to you...",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      path: "#",
      status: "Coming Soon",
      popular: false,
    },
  ];

  const navLinks = ["Overview", "Tools", "Activity", "Settings"];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white h-14 flex items-center justify-between px-8 border-b border-gray-100 shrink-0 z-50">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-black">
            T
          </div>
          <span className="text-gray-900 text-lg font-black tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
            travsplatform
          </span>
          <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link}
              className={`text-sm font-medium cursor-pointer transition-colors ${
                link === "Overview"
                  ? "text-gray-900 font-bold border-b-2 border-orange-500 pb-0.5"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-gray-500 text-xs cursor-text">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-gray-400">Search...</span>
            <span className="bg-gray-200 text-gray-500 text-[10px] px-1 rounded">⌘K</span>
          </div>

          {/* Bell */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 cursor-pointer hover:text-gray-900">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="text-gray-500 text-xs font-bold flex items-center gap-1.5 hover:text-gray-900 transition-colors"
          >
            <span>Sign out</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your toolkit</h1>
            <p className="text-sm text-gray-400 mt-1">Pick a workspace to jump back in.</p>
          </div>
          <a className="text-sm font-semibold text-[#E8960C] flex items-center gap-1 cursor-pointer hover:text-[#c97e0a]">
            Browse all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => tool.path !== "#" && navigate(tool.path)}
              className={`group relative bg-white rounded-2xl border-[1.5px] p-6 flex flex-col transition-all duration-200 ${
                tool.path !== "#"
                  ? "border-[#ede9e0] hover:border-[#E8960C] hover:shadow-xl hover:shadow-orange-100 cursor-pointer hover:-translate-y-0.5"
                  : "border-[#ede9e0] opacity-70 cursor-default"
              }`}
            >
              {/* Popular badge */}
              {tool.popular && (
                <span className="absolute top-4 right-4 bg-[#fdf3e0] text-[#c97e0a] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                  Popular
                </span>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-200 bg-[#fdf3e0] group-hover:bg-[#E8960C] group-hover:scale-105"
              >
                <span className="text-[#E8960C] group-hover:text-white transition-colors duration-200">
                  {tool.icon}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-1.5">{tool.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed flex-1">{tool.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#f0ece4]">
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-gray-500">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      tool.status === "Active" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {tool.status}
                </span>

                {tool.path !== "#" && (
                  <span className="text-xs font-semibold text-[#E8960C] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* What's New Banner */}
        <div className="mt-8 bg-[#fffaee] border-[1.5px] border-[#fde8a0] rounded-2xl px-10 py-9 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#fff3cd] text-[#a16207] text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              What's new
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1.5">
              Email Templates is shipping soon.
            </h2>
            <p className="text-sm text-gray-400">
              Get early access to design beautiful, on-brand emails directly from your workspace.
            </p>
          </div>
          <button className="ml-10 shrink-0 bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-700 transition-colors">
            Join the waitlist
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-xs bg-white border-t border-gray-100">
        &copy; 2026 TravsPlatform Admin Portal. All rights reserved.
      </footer>
    </div>
  );
}