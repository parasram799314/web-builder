// src/components/Packages/PackageTableView.jsx
import React, { useState } from "react";
import PackageModal from "./PackageModal";
import { usePageContext } from "../../context/PageContext";

const BRAND_YELLOW = "#E8960C";
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Utility Functions ────────────────────────────────────────────────────────
function ymToDate(ym) {
  if (!ym) return new Date();
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

function ymLabel(ym) {
  if (!ym) return "";
  const [y, m] = ym.split("-").map(Number);
  return MONTHS_SHORT[m - 1] + " " + y;
}

function ymShort(mk) {
  if (!mk || mk === "pending") return { month: "Pending", year: "" };
  const [y, m] = mk.split("-").map(Number);
  return { month: MONTHS_SHORT[m - 1], year: y };
}

/**
 * Returns all month keys between startMonth and endMonth (inclusive)
 * Format: "YYYY-MM"
 */
function monthRange(start, end) {
  if (!start) return [];
  const months = [];
  let cur = ymToDate(start);
  const last = ymToDate(end || start);
  
  // Safety cap to prevent infinite loops (max 2 years range)
  let safety = 0;
  while (cur <= last && safety < 24) {
    const key = cur.getFullYear() + "-" + String(cur.getMonth() + 1).padStart(2, "0");
    months.push(key);
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    safety++;
  }
  return months;
}

// Collect all unique month keys across all packages
function getAllMonthKeys(packages) {
  const keys = new Set();
  let hasPending = false;

  packages.forEach((pkg) => {
    const start = pkg.startMonth || pkg.month;
    const end = pkg.endMonth || start;
    if (start) {
      monthRange(start, end).forEach((k) => keys.add(k));
    } else {
      hasPending = true;
    }
  });

  const sortedKeys = [...keys].sort();
  if (hasPending) sortedKeys.push("pending");
  return sortedKeys;
}

// Packages that belong to a given month key
// Packages that belong to a given month key
function pkgsForMonth(packages, mk) {
  if (mk === "pending") {
    return packages.filter(pkg => !(pkg.startMonth || pkg.month) && !(pkg.months?.length));
  }
  return packages.filter((pkg) => {
    // New months array check
    if (pkg.months?.length) {
      const monthNum = mk.split("-")[1];
      return pkg.months.includes(monthNum);
    }
    // Old startMonth/endMonth fallback
    const start = pkg.startMonth || pkg.month;
    const end = pkg.endMonth || start;
    if (!start) return false;
    return monthRange(start, end).includes(mk);
  });
}

function spanMonths(pkg) {
  const start = pkg.startMonth || pkg.month;
  const end = pkg.endMonth || start;
  if (!start) return 0;
  return monthRange(start, end).length;
}

function formatPrice(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function typeEmoji(type) {
  const map = {
    Cultural: "🏛",
    Nature: "🌿",
    Adventure: "⛰️",
    Beach: "🏖️",
    Honeymoon: "💑",
    Pilgrimage: "🕌",
    "Hill Station": "🏔️",
    Wildlife: "🐯",
  };
  return map[type] || "✈️";
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p
        className="text-lg font-bold text-gray-800"
        style={color ? { color } : {}}
      >
        {value}
      </p>
    </div>
  );
}

// ── Single Package Row ────────────────────────────────────────────────────────
function PackageTableRow({ pkg, themeColor, onEdit, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false);

  const span = spanMonths(pkg);
  const isMultiMonth = span > 1;
  const rangeLabel = isMultiMonth
    ? ymLabel(pkg.startMonth || pkg.month) + " – " + ymLabel(pkg.endMonth || pkg.startMonth || pkg.month)
    : null;

  return (
    <div style={{ borderBottom: "0.5px solid #f0f0f0" }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
      {/* Thumbnail */}
      <div className="w-11 h-9 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0 flex items-center justify-center text-lg">
        {pkg.image ? (
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <span style={{ fontSize: 18 }}>{typeEmoji(pkg.type)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{pkg.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-[11px] text-gray-400">{pkg.duration}</span>
          {pkg.type && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${themeColor}18`, color: themeColor }}>
              {pkg.type}
            </span>
          )}
        </div>
        {isMultiMonth && (
          <div className="mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-700">
              {rangeLabel} · {span}m
            </span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col items-end shrink-0">
        {pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price) && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-red-500 line-through">
              {formatPrice(pkg.originalPrice)}
            </span>
            <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1 rounded">
              -{Math.round(((Number(pkg.originalPrice) - Number(pkg.price)) / Number(pkg.originalPrice)) * 100)}%
            </span>
          </div>
        )}
        <p className="text-sm font-bold" style={{ color: themeColor }}>
          {formatPrice(pkg.price)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 border border-gray-200">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        {!confirmDel ? (
          <button onClick={() => setConfirmDel(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 border border-gray-200">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        ) : (
          <button onClick={onDelete}
            className="px-2 h-7 text-[10px] font-bold rounded-lg bg-red-500 text-white">
            Confirm?
          </button>
        )}
      </div>
    </div>
  );
}
// ── Main PackageTableView Component ──────────────────────────────────────────
export default function PackageTableView({ onBack }) {
  const ctx = usePageContext();
  const packages = ctx?.pageData?.packages || [];
  const themeColor = ctx?.pageData?.themeColor || BRAND_YELLOW;

  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [prefillMonth, setPrefillMonth] = useState("");

  const monthKeys = getAllMonthKeys(packages);

  const handleSave = (pkg) => {
    if (!ctx) return;
    const existing = ctx.pageData.packages || [];
    const updated = editingPkg
      ? existing.map((p) => (p.id === pkg.id ? pkg : p))
      : [...existing, pkg];
    ctx.updateField("packages", updated);
    ctx.saveDraft(null, { ...ctx.pageData, packages: updated });
    setShowModal(false);
    setEditingPkg(null);
    setPrefillMonth("");
  };

  const handleDelete = (id) => {
    if (!ctx) return;
    const updated = (ctx.pageData.packages || []).filter((p) => p.id !== id);
    ctx.updateField("packages", updated);
    ctx.saveDraft(null, { ...ctx.pageData, packages: updated });
  };

  const openAdd = (month = "") => {
    setEditingPkg(null);
    setPrefillMonth(month === "pending" ? "" : month);
    setShowModal(true);
  };

  const openEdit = (pkg) => {
    setEditingPkg(pkg);
    setPrefillMonth("");
    setShowModal(true);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <div>
            <h1 className="text-sm font-bold text-gray-800">Package Manager</h1>
            <p className="text-[11px] text-gray-400">Month-wise travel packages</p>
          </div>
        </div>
        <button
          onClick={() => openAdd("")}
          className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: themeColor }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Package
        </button>
      </div>

      {/* ── Summary Bar ── */}
      {packages.length > 0 && (
        <div className="px-4 pt-4 pb-0 max-w-3xl mx-auto w-full grid grid-cols-2 gap-3">
          <StatCard label="Total Packages" value={packages.length} />
          <StatCard label="Active Months" value={monthKeys.length} />
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full">
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">✈️</div>
            <p className="text-gray-700 font-semibold text-sm mb-1">No packages yet</p>
            <p className="text-gray-400 text-xs mb-5">
              Add your first travel package — it will appear month-wise below
            </p>
            <button
              onClick={() => openAdd("")}
              className="flex items-center gap-2 text-white font-semibold text-xs px-5 py-2.5 rounded-lg"
              style={{ background: themeColor }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add First Package
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-3">
            {monthKeys.map((mk) => {
              const pkgsInMonth = pkgsForMonth(packages, mk);
              if (!pkgsInMonth.length) return null;
              const { month, year } = ymShort(mk);
              const isPending = mk === "pending";

              return (
                <div
                  key={mk}
                  className="flex rounded-xl overflow-hidden border border-gray-200 bg-white"
                >
                  {/* Left: Month Label */}
                 {/* Left: Month Label — IPL style */}
<div
  className="flex flex-col items-center justify-center shrink-0 w-[72px] text-center gap-1 py-4 px-2"
  style={{
    background: isPending ? "#f8fafc" : `${themeColor}10`,
    borderRight: isPending ? "2px solid #e2e8f0" : `2px solid ${themeColor}30`,
    alignSelf: "stretch",
  }}
>
  <span
    className="font-bold leading-none"
    style={{ fontSize: 22, color: isPending ? "#64748b" : themeColor }}
  >
    {month}
  </span>
  {year && (
    <span className="text-[11px] text-gray-400 font-medium">{year}</span>
  )}
  <span
    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-1"
    style={{
      background: isPending ? "#f1f5f9" : `${themeColor}20`,
      color: isPending ? "#64748b" : themeColor,
    }}
  >
    {pkgsInMonth.length} pkg{pkgsInMonth.length !== 1 ? "s" : ""}
  </span>
</div>

                  {/* Right: Package Rows */}
                  <div className="flex-1 flex flex-col divide-y divide-gray-100">
                    {pkgsInMonth.map((pkg) => (
                      <PackageTableRow
                        key={pkg.id}
                        pkg={pkg}
                        themeColor={themeColor}
                        onEdit={() => openEdit(pkg)}
                        onDelete={() => handleDelete(pkg.id)}
                      />
                    ))}

                    {/* Add to this month */}
                    <button
                      onClick={() => openAdd(mk)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-orange-50 text-left"
                      style={{ color: isPending ? "#94a3b8" : themeColor }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center border"
                        style={{ borderColor: isPending ? "#cbd5e1" : themeColor }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                      {isPending ? "Add package" : `Add to ${month} ${year}`}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add new */}
            <button
              onClick={() => openAdd("")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all text-xs font-semibold"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add new package (new month)
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <PackageModal
          pkg={editingPkg}
          prefillMonth={prefillMonth}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingPkg(null);
            setPrefillMonth("");
          }}
        />
      )}
    </div>
  );
}
