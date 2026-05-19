// src/components/Admin/AdminToolbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { usePageContext } from "../../context/PageContext";

const BRAND_YELLOW = "#E8960C";

// --- Sub-Component: Branding Settings ---
export function BrandingSettings() {
  const context = usePageContext();
  const pageData = context?.pageData || {};
  const updateField = context?.updateField || (() => {});
  const uploadLogo = context?.uploadLogo || (async () => null);

  const [brandingMode, setBrandingMode] = useState(pageData?.branding?.type || "text");
  const [companyName, setCompanyName] = useState(pageData?.branding?.type === "text" ? pageData?.branding?.value || "" : "");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(pageData?.branding?.type === "logo" ? pageData?.branding?.value : null);
  const fileRef = useRef();

  const FONTS = [
    { name: "Inter", family: "'Inter', sans-serif" },
    { name: "Playfair Display", family: "'Playfair Display', serif" },
    { name: "DM Sans", family: "'DM Sans', sans-serif" },
    { name: "Space Grotesk", family: "'Space Grotesk', sans-serif" },
    { name: "Roboto", family: "'Roboto', sans-serif" },
    { name: "Poppins", family: "'Poppins', sans-serif" },
    { name: "Georgia", family: "Georgia, serif" },
  ];

  // Sync with context if it changes from outside
  useEffect(() => {
    if (pageData?.branding) {
      setBrandingMode(pageData.branding.type);
      if (pageData.branding.type === "text") setCompanyName(pageData.branding.value || "");
      else setLogoPreview(pageData.branding.value || null);
    }
  }, [pageData?.branding]);

  const handleBrandingModeChange = (mode) => {
    setBrandingMode(mode);
    updateField("branding", { type: mode, value: mode === "text" ? companyName : (logoPreview || "") });
  };

  const handleNameChange = (e) => {
    setCompanyName(e.target.value);
    updateField("branding", { type: "text", value: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploadingLogo(true);
    try {
      const url = await uploadLogo(file);
      if (url) {
        setLogoPreview(url);
        updateField("branding", { type: "logo", value: url });
      }
    } catch (err) {
      console.error("Logo upload failed", err);
    }
    setUploadingLogo(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Branding Style</label>
        <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
          <button onClick={() => handleBrandingModeChange("text")} className="flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all" style={{ background: brandingMode === "text" ? BRAND_YELLOW : "transparent", color: brandingMode === "text" ? "#fff" : "#6b7280" }}>TEXT</button>
          <button onClick={() => handleBrandingModeChange("logo")} className="flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all" style={{ background: brandingMode === "logo" ? BRAND_YELLOW : "transparent", color: brandingMode === "logo" ? "#fff" : "#6b7280" }}>LOGO</button>
        </div>
      </div>
      {brandingMode === "text" ? (
        <input type="text" value={companyName} onChange={handleNameChange} placeholder="Enter Name..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-200 outline-none" />
      ) : (
        <div className="flex flex-col items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl bg-white">
          {logoPreview ? <img src={logoPreview} alt="Logo" className="h-12 w-auto object-contain rounded" /> : <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">🖼️</div>}
          <button onClick={() => fileRef.current.click()} disabled={uploadingLogo} className="w-full text-[10px] font-bold py-2 rounded-lg border border-gray-200 hover:bg-gray-50">{uploadingLogo ? "..." : "UPLOAD LOGO"}</button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </div>
      )}

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Typography</label>
        <select 
          value={pageData?.fontFamily || "'Inter', sans-serif"} 
          onChange={(e) => updateField("fontFamily", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-200 outline-none bg-white cursor-pointer"
        >
          {FONTS.map(f => (
            <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// --- Sub-Component: Theme Settings ---
export function ThemeSettings() {
  const context = usePageContext();
  const pageData = context?.pageData || {};
  const updateField = context?.updateField || (() => {});
  const themeColor = pageData?.themeColor || BRAND_YELLOW;
  const [showPresets, setShowPresets] = useState(false);

  const PRESETS = [
    { name: "Ocean", primary: "#0ea5e9" }, { name: "Forest", primary: "#16a34a" },
    { name: "Sunset", primary: "#E8960C" }, { name: "Royal", primary: "#7c3aed" },
    { name: "Rouge", primary: "#dc2626" }, { name: "Noir", primary: "#111827" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Theme Color</label>
      <div className="grid grid-cols-6 gap-2">
        {["#E8960C", "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#111827"].map((c) => (
          <button key={c} onClick={() => updateField("themeColor", c)} className={`w-full aspect-square rounded-full border-2 transition-transform hover:scale-110 ${themeColor === c ? "border-gray-400 scale-110 shadow-sm" : "border-transparent"}`} style={{ background: c }} />
        ))}
        <div className="relative group w-full aspect-square">
          <input type="color" value={themeColor} onChange={(e) => updateField("themeColor", e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-[10px] bg-white group-hover:border-orange-400 transition-colors">🌈</div>
        </div>
      </div>
      <button onClick={() => setShowPresets(!showPresets)} className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all">
        <span>🎨 Theme Presets</span>
        <span style={{ color: BRAND_YELLOW }}>{showPresets ? "▲" : "▼"}</span>
      </button>
      {showPresets && (
        <div className="grid grid-cols-2 gap-1 p-2 bg-gray-50 rounded-lg border border-gray-100 mt-1">
          {PRESETS.map((t) => (
            <button key={t.name} onClick={() => { updateField("themeColor", t.primary); setShowPresets(false); }} className="flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:bg-white p-2 rounded-lg transition-colors">
              <span className="w-3 h-3 rounded-full" style={{ background: t.primary }} /> {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Sub-Component: Global Actions (Save/Publish) ---
export function GlobalActions({ toolMode = "website" }) {
  const context = usePageContext();
  const saveDraft = context?.saveDraft || (() => {});
  const publishPage = context?.publishPage || (() => {});
  const saving = context?.saving || false;
  const publishing = context?.publishing || false;
  const saveMsg = context?.saveMsg || "";
  const isDirty = context?.isDirty || false;

  return (
    <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100">
      {saveMsg && <div className="text-[10px] font-bold p-2 rounded-lg text-center" style={{ background: saveMsg.includes("Error") ? "#fee2e2" : "#dcfce7", color: saveMsg.includes("Error") ? "#dc2626" : "#166534" }}>{saveMsg}</div>}
      <button onClick={() => saveDraft(undefined, undefined, toolMode)} disabled={saving} className="w-full py-2.5 rounded-xl border-2 border-orange-400 text-orange-600 text-xs font-bold hover:bg-orange-50 disabled:opacity-50">
        {saving ? "SAVING..." : "💾 SAVE DRAFT"}
      </button>
      <button onClick={() => publishPage(undefined, toolMode)} disabled={publishing} className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-lg disabled:opacity-50" style={{ background: BRAND_YELLOW }}>
        {publishing ? "PUBLISHING..." : "🚀 PUBLISH LIVE"}
        {isDirty && <span className="inline-block w-2 h-2 rounded-full bg-yellow-300 ml-2 animate-pulse" />}
      </button>
    </div>
  );
}

// Default export
export default function AdminToolbar() {
  return (
    <div className="flex flex-col gap-6">
      <BrandingSettings />
      <ThemeSettings />
      <GlobalActions />
    </div>
  );
}
