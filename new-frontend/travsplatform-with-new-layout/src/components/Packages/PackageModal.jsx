// src/components/Packages/PackageModal.jsx
import React, { useState } from "react";
import { COUNTRY_OPTIONS, getFlagUrl } from "../../data/holidays";

const TYPE_OPTIONS = [
  "Cultural", "Nature", "Adventure", "Beach",
  "Honeymoon", "Pilgrimage", "Hill Station", "Wildlife"
];

const ALL_MONTHS = [
  { label: "Jan", value: "01" }, { label: "Feb", value: "02" },
  { label: "Mar", value: "03" }, { label: "Apr", value: "04" },
  { label: "May", value: "05" }, { label: "Jun", value: "06" },
  { label: "Jul", value: "07" }, { label: "Aug", value: "08" },
  { label: "Sep", value: "09" }, { label: "Oct", value: "10" },
  { label: "Nov", value: "11" }, { label: "Dec", value: "12" },
];

function getMonthNum(ym) {
  if (!ym) return null;
  return ym.split("-")[1];
}

function calcDuration(days, nights) {
  if (!days && !nights) return "";
  const d = days || 0;
  const n = nights || 0;
  return `${d} Days / ${n} Nights`;
}

const CURRENT_YEAR = new Date().getFullYear();

const EMPTY = {
  title: "",
  duration: "",
  days: "",
  nights: "",
  price: "",
  originalPrice: "",
  image: "",
  type: "Nature",
  months: [],
  countries: [],
  showInOthers: false,
  detailsLink: "",
};

export default function PackageModal({ pkg, onSave, onClose, prefillMonth }) {
  const getInitialMonths = () => {
    if (pkg?.months?.length) return pkg.months;
    const start = pkg?.startMonth || pkg?.month || prefillMonth;
    const end = pkg?.endMonth || start;
    if (!start) return prefillMonth ? [getMonthNum(prefillMonth)] : [];
    const s = parseInt(start.split("-")[1]);
    const e = parseInt((end || start).split("-")[1]);
    const arr = [];
    for (let i = s; i <= e; i++) arr.push(String(i).padStart(2, "0"));
    return arr;
  };

  const getInitialDays = () => {
    if (pkg?.days) return pkg.days;
    if (pkg?.duration) {
      const match = pkg.duration.match(/(\d+)\s*Days/i);
      return match ? match[1] : "";
    }
    return "";
  };

  const [form, setForm] = useState({
    ...EMPTY,
    ...(pkg || {}),
    days: getInitialDays(),
    duration: pkg?.duration || "",
    months: getInitialMonths(),
    countries: pkg?.countries || [],
    showInOthers: pkg?.showInOthers || false,
    detailsLink: pkg?.detailsLink || "",
  });

  const [error, setError] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryResults, setShowCountryResults] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleMonth = (val) => {
    setForm((f) => {
      const already = f.months.includes(val);
      return {
        ...f,
        months: already ? f.months.filter((m) => m !== val) : [...f.months, val],
      };
    });
  };

  const selectAllMonths = () => {
    setForm(f => ({
      ...f,
      months: f.months.length === ALL_MONTHS.length ? [] : ALL_MONTHS.map(m => m.value)
    }));
  };

  const toggleCountry = (val) => {
    setForm((f) => {
      const already = f.countries.includes(val);
      return {
        ...f,
        countries: already ? f.countries.filter((c) => c !== val) : [...f.countries, val],
      };
    });
  };

  const addCountry = (val) => {
    if (!val) return;
    setForm((f) => {
      if (f.countries.includes(val)) return f;
      return { ...f, countries: [...f.countries, val] };
    });
    setCountrySearch("");
    setShowCountryResults(false);
  };

  const handleDaysChange = (val) => {
    const days = parseInt(val) || 0;
    const nights = Math.max(0, days - 1);
    setForm((f) => ({
      ...f,
      days: val,
      nights: String(nights),
      duration: calcDuration(val, String(nights))
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.price || isNaN(Number(form.price))) return setError("Valid price required.");
    if (form.months.length === 0) return setError("Select at least one month.");

    setError("");
    const sortedMonths = [...form.months].sort();
    const startMonth = `${CURRENT_YEAR}-${sortedMonths[0]}`;
    const endMonth = `${CURRENT_YEAR}-${sortedMonths[sortedMonths.length - 1]}`;

    const finalData = {
      ...form,
      id: pkg?.id || `pkg_${Date.now()}`,
      price: String(Number(form.price)),
      originalPrice: form.originalPrice ? String(Number(form.originalPrice)) : "",
      months: sortedMonths,
      countries: form.countries,
      showInOthers: form.showInOthers,
      detailsLink: form.detailsLink,
      startMonth, endMonth, month: startMonth,
      duration: form.duration || calcDuration(form.days, form.nights),
    };
    onSave(finalData);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

  const filteredCountries = COUNTRY_OPTIONS.filter(c => 
    c.label.toLowerCase().includes(countrySearch.toLowerCase()) && 
    !form.countries.includes(c.key)
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] p-5 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-tight">
          <span className="text-xl">📦</span> {pkg ? "Edit" : "Add"} Package
        </h2>

        {error && <div className="text-red-600 text-[10px] font-bold mb-3">⚠️ {error}</div>}

        <div className="flex flex-col gap-3">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-wider">Package Title *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Magical Bali Escape" className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-wider">Image URL</label>
              <input type="url" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/..." className={inputClass} />
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-wider">Trip Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                {TYPE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-wider">Days (Nights auto)</label>
              <input type="number" value={form.days} onChange={(e) => handleDaysChange(e.target.value)} placeholder="Days" className={inputClass} />
              {form.days && <p className="text-[9px] text-orange-500 font-bold mt-1 uppercase italic">{form.days} Days / {form.nights} Nights</p>}
            </div>
          </div>

          {/* Section 3: Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-wider">MRP (₹)</label>
              <input type="number" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} placeholder="Original price" className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-wider">Offer Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Final price" className={inputClass} />
            </div>
          </div>

          {/* Section 4: Countries */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Destinations</label>
              <div className="flex flex-wrap gap-1">
                {form.countries.map((cKey) => {
                  const c = COUNTRY_OPTIONS.find(opt => opt.key === cKey);
                  return (
                    <button key={cKey} onClick={() => toggleCountry(cKey)} className="flex items-center gap-0.5 px-1 bg-orange-100 text-orange-700 rounded text-[8px] font-bold border border-orange-200">
                      {c?.code ? (
                        <img src={getFlagUrl(c.code)} alt={c.label} className="w-2.5 h-2.5 object-contain" />
                      ) : (
                        <span>{c?.flag}</span>
                      )}
                      <span className="mx-0.5">{c?.label}</span>
                      <svg width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 relative">
              <div className="flex-1 relative">
                <input type="text" value={countrySearch} onChange={(e) => { setCountrySearch(e.target.value); setShowCountryResults(true); }} onFocus={() => setShowCountryResults(true)} placeholder="Type country name..." className={inputClass} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">🔍</span>
              </div>
              <button 
                onClick={() => filteredCountries.length > 0 && addCountry(filteredCountries[0].key)} 
                className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 hover:bg-orange-600 transition-colors"
                title="Add multiple destinations"
              >
                <span>+</span> Add
              </button>
              {showCountryResults && countrySearch && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-xl z-10 max-h-32 overflow-y-auto">
                  {filteredCountries.map(c => (
                    <button key={c.key} onClick={() => addCountry(c.key)} className="w-full text-left px-3 py-2 text-xs hover:bg-orange-50 flex items-center gap-2">
                      {c.code ? (
                        <img src={getFlagUrl(c.code)} alt={c.label} className="w-4 h-4 object-contain" />
                      ) : (
                        <span>{c.flag}</span>
                      )}
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Months */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Available Months *</label>
              <button onClick={selectAllMonths} className="text-[9px] font-black text-orange-600 uppercase tracking-tight px-2 py-0.5 bg-orange-50 border border-orange-200 rounded-md">
                {form.months.length === ALL_MONTHS.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {ALL_MONTHS.map((m) => {
                const selected = form.months.includes(m.value);
                return (
                  <button key={m.value} type="button" onClick={() => toggleMonth(m.value)} className={`py-1.5 rounded-lg text-[9px] font-bold border flex items-center justify-center transition-all ${selected ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-orange-200"}`}>{m.label}</button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Links & Visibility */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block uppercase tracking-wider">Booking/Details Link</label>
              <input type="url" value={form.detailsLink} onChange={(e) => set("detailsLink", e.target.value)} placeholder="https://..." className={inputClass} />
            </div>
            <div className="flex items-center gap-2 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
              <input type="checkbox" id="showInOthers" checked={form.showInOthers} onChange={(e) => set("showInOthers", e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <div className="min-w-0">
                <label htmlFor="showInOthers" className="text-[10px] font-bold text-orange-800 block">Show in "Others" Row</label>
                <p className="text-[8px] text-orange-600/70 italic">Package will be shown at the bottom of all calendars.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-600 font-bold hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-xs text-white font-bold shadow-md transition-all active:scale-95" style={{ background: "#E8960C" }}>{pkg ? "Save Changes" : "Add Package"}</button>
        </div>
      </div>
    </div>
  );
}
