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
      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-8 flex flex-col justify-center">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1" style={{ fontFamily: "Georgia, serif" }}>
                Welcome back.
              </h1>
              <p className="text-sm text-gray-500 font-medium max-w-md">
                Manage your travel business with our integrated suite of professional tools.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Status</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-bold text-gray-600 uppercase">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Your Toolkit</h2>
          <div className="h-px flex-1 mx-6 bg-gray-100"></div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => tool.path !== "#" && navigate(tool.path)}
              className={`group relative bg-white rounded-[2rem] border border-gray-100 p-8 flex flex-col transition-all duration-500 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.05)] ${
                tool.path !== "#"
                  ? "hover:border-[#E8960C]/20 hover:shadow-[0_30px_60px_-15px_rgba(232,150,12,0.15)] cursor-pointer hover:-translate-y-2"
                  : "opacity-60 cursor-default"
              }`}
            >
              {/* Popular badge */}
              {tool.popular && (
                <span className="absolute top-6 right-6 bg-orange-50 text-[#E8960C] text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-orange-100/50">
                  Featured
                </span>
              )}

              {/* Icon Container - Glass Effect */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 bg-[#F8F9FA] group-hover:bg-[#E8960C] group-hover:rotate-[8deg] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <div className="text-[#E8960C] group-hover:text-white transition-all duration-500 scale-125">
                  {tool.icon}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E8960C] transition-colors tracking-tight">{tool.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">{tool.description}</p>
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    {tool.status === "Active" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${tool.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}></span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {tool.status}
                  </span>
                </div>

                {tool.path !== "#" && (
                  <div className="flex items-center gap-1.5 text-[#E8960C] font-bold text-[11px] uppercase tracking-wider translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    <span>Launch</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Professional Footer */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <img src="/logo3.png" alt="Logo" className="h-5 w-auto grayscale opacity-40" />
            <div className="h-4 w-px bg-gray-100"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              &copy; 2026 TravsPlatform Enterprise.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {["Security", "Privacy", "Terms", "Support"].map(item => (
              <a key={item} href="#" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#E8960C] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
