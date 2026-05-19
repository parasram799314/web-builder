// src/components/Packages/PackagesList.jsx
import React, { useState } from "react";
import PackageCard from "./PackageCard";
import PackageModal from "./PackageModal";
import PackageTableView from "./PackageTableView";
import { usePageContext } from "../../context/PageContext";

// ─── Main PackagesList ────────────────────────────────────────────────────────
export default function PackagesList({ isAdmin = false, packages: propPackages, isSidebar = false, visitCountry = "" }) {
  const ctx = usePageContext();
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  const allPackages = isAdmin && ctx ? ctx.pageData?.packages || [] : propPackages || [];

  // Filter main packages: Match visitCountry (if provided) and NOT marked as ONLY others (though usually we show them in both if showInOthers is true)
  // Actually, the user said "woh package ek niche wali alag se row show karenge usme show hoga".
  // Let's filter the main ones to NOT show those that are ONLY for others? No, usually others means "also show here".
  
  const recommendedPackages = allPackages.filter(pkg => {
    // If visitCountry is selected, only show packages that include this country
    if (visitCountry && pkg.countries && pkg.countries.length > 0) {
      return pkg.countries.includes(visitCountry);
    }
    return true;
  });

  const otherPackages = allPackages.filter(pkg => pkg.showInOthers === true);

  const handleSave = (pkg) => {
    if (!ctx) return;
    
    // Use global functions to sync across all tools
    if (editingPkg) {
      ctx.updateGlobalPackage(pkg.id, pkg);
    } else {
      ctx.addGlobalPackage(pkg);
    }
    
    setShowModal(false);
    setEditingPkg(null);
  };

  const handleDelete = (id) => {
    if (!ctx) return;
    if (window.confirm("Are you sure you want to delete this package globally?")) {
      ctx.deleteGlobalPackage(id);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPkg(pkg);
    setShowModal(true);
  };

  const BRAND_YELLOW = "#E8960C";
  const displayColor = isSidebar ? BRAND_YELLOW : (ctx?.pageData?.themeColor || BRAND_YELLOW);

  const PackageGrid = ({ pkgs, emptyText }) => {
    if (pkgs.length === 0) return (
      <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center bg-white/50">
        <p className="text-xs text-gray-400">{emptyText}</p>
      </div>
    );
    return (
      <div className={isSidebar ? "flex flex-col gap-3" : "grid grid-cols-1 sm:grid-cols-3 gap-3"}>
        {pkgs.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} index={i} isAdmin={isAdmin} isSidebar={isSidebar} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    );
  };

  return (
    <div className={isSidebar ? "mt-0" : "mt-5"}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
          {isSidebar ? "Manage Packages" : "Smart Package Recommendations"}
        </p>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowTable(true)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              📋 View Table
            </button>
            <button
              onClick={() => { setEditingPkg(null); setShowModal(true); }}
              className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
              style={{ background: displayColor }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
              Add
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Recommended Row */}
        <div>
          {visitCountry && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-tighter">
                Filtered for {visitCountry}
              </span>
            </div>
          )}
          <PackageGrid 
            pkgs={recommendedPackages} 
            emptyText={visitCountry ? `No packages found for ${visitCountry}` : "No packages found for selected month"} 
          />
        </div>

        {/* Others Row */}
        {!isSidebar && otherPackages.length > 0 && (
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Others</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <PackageGrid pkgs={otherPackages} emptyText="No other packages available" />
          </div>
        )}
      </div>

      {/* Full-screen Table View Overlay */}
      {showTable && (
        <div className="fixed inset-0 z-[60] bg-white">
          <PackageTableView onBack={() => setShowTable(false)} />
        </div>
      )}

      {showModal && (
        <PackageModal pkg={editingPkg} onSave={handleSave} onClose={() => { setShowModal(false); setEditingPkg(null); }} />
      )}
    </div>
  );
}
