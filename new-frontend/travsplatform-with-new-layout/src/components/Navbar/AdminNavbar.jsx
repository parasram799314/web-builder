// src/components/Navbar/AdminNavbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePageContext } from "../../context/PageContext";

export default function AdminNavbar({ toolMode, onGenerateLink, onViewTable, onShowMyLinks }) {
  const { logout } = useAuth();
  const { saving, saveMsg } = usePageContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  // Admin dashboard navbar - FIXED YELLOW
  const adminBg = "#E8960C"; 
  const brandingName = "travsplatform";

  return (
    <nav
      style={{ background: adminBg }}
      className="px-8 py-0 flex items-center justify-between h-14 shadow-md z-50 border-b border-orange-600"
    >
      {/* Logo / Branding */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <img src="/logo3.png" alt="Logo" className="h-8 w-auto object-contain" />
        </button>
        <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {toolMode === "calendar" ? "Calendar Builder" : "Website Builder"}
        </span>
      </div>

      {/* Center: Nav links - EMPTY */}
      <div className="hidden md:flex items-center gap-8 flex-1">
      </div>

      {/* Right: Save status + Generate Link + My Links + Logout */}
      <div className="flex items-center gap-3">
        {saveMsg && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{
              background: saveMsg.includes("Error") ? "#fee2e2" : "#dcfce7",
              color: saveMsg.includes("Error") ? "#dc2626" : "#166534",
            }}
          >
            {saveMsg}
          </span>
        )}
        {saving && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-white/20"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Back to Tools
        </button>

        <button
          onClick={onShowMyLinks}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-white/30"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          My Links
        </button>

        <button
          onClick={onViewTable}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-white/30"
        >
          
          All Packages
        </button>

        <button
          onClick={onGenerateLink}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          Generate Link
        </button>

        <button
          onClick={handleLogout}
          className="text-white text-xs font-medium hover:text-yellow-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
