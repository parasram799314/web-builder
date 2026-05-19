// src/components/RightPanel/RightPanel.jsx
import React, { useState } from "react";
import ContactForm from "../ContactForm/ContactForm";
import { usePageContext } from "../../context/PageContext";
import { COUNTRY_OPTIONS, getFlagUrl } from "../../data/holidays";

const SOCIAL = [
  { label: "f", color: "#1877F2", title: "Facebook" },
  { label: "𝕏", color: "#000000", title: "Twitter/X" },
  { label: "in", color: "#E1306C", title: "Instagram" },
  { label: "li", color: "#0A66C2", title: "LinkedIn" },
];

// ─── Admin version: live editing ─────────────────────────────────────────────
function AdminRightPanel({ part }) {
  const { pageData, updateField, savePage } = usePageContext();
  const [showAddCountry, setShowAddCountry] = useState(false);

  const selected = pageData?.countries || ["india"];

  const toggleCountry = (key) => {
    if (key === "india" && selected.length === 1 && selected.includes("india")) return;
    let next;
    if (selected.includes(key)) {
      next = selected.filter((c) => c !== key);
    } else {
      next = [...selected, key];
    }
    updateField("countries", next);
    savePage({ ...pageData, countries: next });
  };

  const renderTop = () => (
    <>
      {/* Profit Margins */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3">Profit Margins (%)</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase">Flight Margin</label>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{pageData?.flightMargin || 0}%</span>
            </div>
            <input 
              type="range" min="0" max="100" step="1"
              value={pageData?.flightMargin || 0}
              onChange={(e) => updateField("flightMargin", parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase">Hotel Margin</label>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{pageData?.hotelMargin || 0}%</span>
            </div>
            <input 
              type="range" min="0" max="100" step="1"
              value={pageData?.hotelMargin || 0}
              onChange={(e) => updateField("hotelMargin", parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </div>
        <p className="text-[9px] text-gray-400 mt-3 italic">
          * This percentage will be added to the base prices shown on your site.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Compare Holidays</h3>
          <button
            onClick={() => setShowAddCountry((v) => !v)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-lg font-bold transition-colors"
            style={{
              background: showAddCountry ? "#d1d5db" : "#E8960C",
              color: showAddCountry ? "#374151" : "#fff",
            }}
            title="Add/remove country"
          >
            {showAddCountry ? "×" : "+"}
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {COUNTRY_OPTIONS.map((country) => {
            const isSelected = selected.includes(country.key);
            if (!isSelected && !showAddCountry) return null;
            const isHost = selected[0] === country.key;
            return (
              <label
                key={country.key}
                className={`flex items-center gap-2.5 cursor-pointer group p-1.5 rounded-lg transition-colors ${isHost && isSelected ? 'bg-yellow-50 border border-yellow-100 shadow-sm' : ''}`}
              >
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    background: isSelected ? "#E8960C" : "#fff",
                    borderColor: isSelected ? "#E8960C" : "#d1d5db",
                  }}
                  onClick={() => toggleCountry(country.key)}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  {country.code ? (
                    <img src={getFlagUrl(country.code)} alt={country.label} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="text-xl">{country.flag}</span>
                  )}
                  {country.label}
                  {isHost && (
                    <span className="text-[9px] font-black bg-yellow-200 text-yellow-800 px-1 rounded uppercase tracking-tighter">Host</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>

        {showAddCountry && (
          <p className="text-xs text-gray-400 mt-3">
            ✓ Click checkboxes to add/remove countries from the calendar.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Global Schedule
        </span>
        <div className="flex items-center gap-1">
          <img src={getFlagUrl("IN")} alt="India" className="w-5 h-5 object-contain" />
          <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  const renderBottom = () => (
    <>
      {pageData?.showContactForm ? (
        <ContactForm isAdmin={true} />
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400">
            Contact form is hidden (toggle in toolbar)
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Stay Connected</h3>
        <div className="flex items-center gap-2">
          {SOCIAL.map(({ label, color, title }) => (
            <button
              key={title}
              title={title}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: color }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      {(!part || part === "top") && renderTop()}
      {(!part || part === "bottom") && renderBottom()}
    </div>
  );
}

// ─── View version: read-only ──────────────────────────────────────────────────
function ViewRightPanel({ part, countries = ["india"], showContactForm = true }) {
  const renderTop = () => (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Compare Holidays</h3>
        <div className="flex flex-col gap-2.5">
          {COUNTRY_OPTIONS.filter((c) => countries.includes(c.key)).map(
            (country, idx) => (
              <label key={country.key} className={`flex items-center gap-2.5 p-1.5 rounded-lg transition-colors ${idx === 0 ? 'bg-yellow-50 border border-yellow-100 shadow-sm' : ''}`}>
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                  style={{ background: "#E8960C", borderColor: "#E8960C" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  {country.code ? (
                    <img src={getFlagUrl(country.code)} alt={country.label} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="text-xl">{country.flag}</span>
                  )}
                  {country.label}
                  {idx === 0 && (
                    <span className="text-[9px] font-black bg-yellow-200 text-yellow-800 px-1 rounded uppercase tracking-tighter">Host</span>
                  )}
                </span>
              </label>
            )
          )}
        </div>
      </div>
    </>
  );

  const renderBottom = () => (
    <>
      {showContactForm && <ContactForm isAdmin={false} />}
      
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Stay Connected</h3>
        <div className="flex items-center gap-2">
          {SOCIAL.map(({ label, color, title }) => (
            <button
              key={title}
              title={title}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: color }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      {(!part || part === "top") && renderTop()}
      {(!part || part === "bottom") && renderBottom()}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function RightPanel({ isAdmin, part, countries, showContactForm }) {
  if (isAdmin) return <AdminRightPanel part={part} />;
  return <ViewRightPanel part={part} countries={countries} showContactForm={showContactForm} />;
}
