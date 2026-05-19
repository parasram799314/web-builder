// src/components/Packages/PackageCard.jsx
import React, { useState } from "react";
import { usePageContext } from "../../context/PageContext";

export default function PackageCard({ pkg, isAdmin, onEdit, onDelete, index, isSidebar = false }) {
  const [requested, setRequested] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { pageData } = usePageContext() || {};

  const BRAND_YELLOW = "#E8960C";
  // Sidebar mein fixed yellow, preview mein dynamic themeColor
  const displayColor = isSidebar ? BRAND_YELLOW : (pageData?.themeColor || BRAND_YELLOW);

  return (
    <div className={`bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col relative group ${isSidebar ? "max-w-full" : ""}`}>
      {/* Admin controls overlay */}
      {isAdmin && (
        <div className={`absolute top-2 right-2 z-10 flex gap-1 ${isSidebar ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
          <button
            onClick={() => onEdit(pkg)}
            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
            title="Edit package"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors border border-gray-100"
              title="Delete package"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => onDelete(pkg.id)}
              className="h-7 px-2 bg-red-500 rounded-full shadow text-white text-[10px] font-bold"
            >
              Confirm
            </button>
          )}
        </div>
      )}

      {/* Image */}
      <div className="relative">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full object-cover"
          style={{ height: isSidebar ? 100 : 140 }}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x140/${displayColor.replace('#', '')}/FFFFFF?text=${encodeURIComponent(
              pkg.title || "Package"
            )}`;
          }}
        />
        <span
          className="absolute top-2 left-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          #{index + 1}
        </span>
      </div>

      <div className={isSidebar ? "p-2.5 flex flex-col flex-1" : "p-3 flex flex-col flex-1"}>
        <h3 className={`font-bold text-gray-800 mb-1 ${isSidebar ? "text-xs line-clamp-1" : "text-sm"}`}>{pkg.title}</h3>
        <div className="flex flex-col mb-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500">{pkg.duration}</p>
            <div className="flex flex-col items-end">
              {pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-red-500 line-through">
                    ₹{Number(pkg.originalPrice).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1 rounded">
                    {Math.round(((Number(pkg.originalPrice) - Number(pkg.price)) / Number(pkg.originalPrice)) * 100)}% OFF
                  </span>
                </div>
              )}
              <p className={`font-bold ${isSidebar ? "text-xs" : "text-base"}`} style={{ color: displayColor }}>
                ₹{Number(pkg.price).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => onEdit(pkg)}
            className="w-full py-1.5 rounded-lg text-[10px] font-bold transition-all mt-auto border uppercase tracking-wider"
            style={{ 
              color: displayColor, 
              borderColor: displayColor,
              background: 'transparent'
            }}
          >
            Edit Details
          </button>
        )}

        {!isAdmin && (
          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const message = encodeURIComponent(`Hi, I'm interested in the "${pkg.title}" package (${pkg.duration})!`);
                window.open(`https://wa.me/?text=${message}`, "_blank");
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shrink-0"
              title="Chat on WhatsApp"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>
            <button
              onClick={() => {
                if (pkg.detailsLink) {
                  window.open(pkg.detailsLink, "_blank");
                } else {
                  setRequested(true);
                }
              }}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white transition-all uppercase tracking-wide truncate"
              style={{ background: requested ? "#22c55e" : displayColor }}
            >
              {requested ? "✓ Sent!" : "View Details"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
