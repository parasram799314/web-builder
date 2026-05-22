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
    <header className="z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 h-16 flex items-center justify-between">
        {/* Left: Path */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dashboard</span>
              <span className="text-gray-300 text-[10px]">/</span>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">
                {toolMode === "calendar" ? "Calendar" : toolMode === "email" ? "Email" : "Website"} Editor
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium hidden md:block">Building travel assets in real-time</p>
          </div>
        </div>

        {/* Center: Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 hover:bg-white hover:shadow-sm text-gray-600 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-all"
          >
            Back to Tools
          </button>

          <button
            onClick={onShowMyLinks}
            className="flex items-center gap-1.5 hover:bg-white hover:shadow-sm text-gray-600 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-all"
          >
            My Links
          </button>

          <button
            onClick={onViewTable}
            className="flex items-center gap-1.5 hover:bg-white hover:shadow-sm text-gray-600 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-all"
          >
            Packages
          </button>

          <button
            onClick={onGenerateLink}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all shadow-md"
          >
            Generate Link
          </button>
        </div>

        {/* Right: Status & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span
                className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tight"
                style={{
                  background: saveMsg.includes("Error") ? "#fee2e2" : "#dcfce7",
                  color: saveMsg.includes("Error") ? "#dc2626" : "#166534",
                }}
              >
                {saveMsg}
              </span>
            )}
            {saving && (
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          <div className="h-6 w-px bg-gray-100"></div>

          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Sign Out"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
