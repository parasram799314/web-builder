import React, { useState } from "react";
import { EMAIL_CATEGORIES, EMAIL_TEMPLATES } from "../../data/emailTemplates";
import WanderlustLuxury from "./promotions/one";
import AzureTrails from "./promotions/second";
import BookingConfirmation from "./confirmations/first";

import axiosInstance from "../../utils/axiosConfig";

// ── Send Email Modal ─────────────────────────────────────────────────────────
function SendEmailModal({ template, onClose, templateData }) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleCopyHTML = async () => {
    try {
      // Create a more realistic HTML based on the template
      const isPromo = template.category === 'promotional';
      const accentColor = template.color || '#fb7185';
      
      const htmlContent = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
          <div style="background-color: #0f2a3d; padding: 25px; text-align: center;">
            <div style="color: #f4c97a; font-size: 20px; font-weight: 900; letter-spacing: 3px;">✈ WANDERLUST</div>
          </div>
          <div style="background: linear-gradient(135deg, ${accentColor} 0%, #000000 150%); padding: 50px 30px; text-align: center; color: #ffffff;">
            <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 10px 0;">${template.name}</h1>
            <p style="font-size: 16px; opacity: 0.9; margin: 0;">Your travel adventure is waiting for you.</p>
          </div>
          <div style="padding: 40px; text-align: center; color: #333;">
            <p style="line-height: 1.6; margin-bottom: 30px;">${template.description}</p>
            <a href="#" style="display: inline-block; background-color: #0f2a3d; color: #f4c97a; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; letter-spacing: 1px;">VIEW DETAILS</a>
          </div>
          <div style="background-color: #f8fafc; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9;">
            © 2026 Wanderlust Travels · Mumbai, India
          </div>
        </div>
      `;

      const type = "text/html";
      const blob = new Blob([htmlContent], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      
      await navigator.clipboard.write(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSendEmail = async () => {
    if (!email) return setError("Please enter an email");
    setSending(true);
    setError("");

    try {
      const response = await axiosInstance.post("/email/send", {
        to: email,
        subject: `Your ${template.name} is ready!`,
        templateId: template.id,
        data: templateData[template.id], // Send the edited data!
        color: template.color // Send the template color!
      });

      if (response.status !== 200) throw new Error("Failed to send email");

      setSent(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error("Send Error:", err);
      setError(err.response?.data?.error || "Failed to send email. Check backend logs.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            {sent ? "✅" : "🚀"}
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-2">
            {sent ? "Email Sent!" : "Send Template"}
          </h3>
          <p className="text-sm text-gray-500 mb-6 px-4">
            {sent 
              ? "Your client will receive the professional template shortly." 
              : "Enter your client's email to send this template directly via our server."}
          </p>

          {!sent && (
            <div className="space-y-4">
              <div className="text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Recipient Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                />
                {error && <p className="text-red-500 text-[10px] mt-1 font-bold">{error}</p>}
              </div>

              <button 
                onClick={handleSendEmail}
                disabled={sending}
                className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span>📧</span> Send Now</>
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-300 uppercase">OR</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              <button 
                onClick={handleCopyHTML}
                className="w-full bg-orange-50 text-orange-600 border border-orange-100 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
              >
                <span>{copied ? "✅" : "📄"}</span> {copied ? "HTML Copied!" : "Copy for Gmail/Outlook"}
              </button>
            </div>
          )}
        </div>
        
        {!sent && (
          <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center">
            <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmailBuilder({ selectedTemplate, setSelectedTemplate, userPackages = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("booking");
  const [zoom, setZoom] = useState(0.75); // Default to 75% to see more
  const [showSendModal, setShowSendModal] = useState(false);
  const [customColor, setCustomColor] = useState(null);

  // Use selectedTemplate.color as base, or customColor if changed
  const activeColor = customColor || selectedTemplate?.color || "#fb7185";

  // State for each template's dynamic data
  const [templateData, setTemplateData] = useState({
    "confirm-1": null,
    "promo-1": null,
    "promo-2": null
  });

  // Reset custom color when template changes
  React.useEffect(() => {
    setCustomColor(null);
  }, [selectedTemplate?.id]);

  const updateTemplateData = (id, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const filteredTemplates = EMAIL_TEMPLATES.filter(
    (t) => t.category === selectedCategory
  );

  // If a template is selected, show the "Editor" placeholder
  if (selectedTemplate) {
    return (
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedTemplate(null)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <h4 className="text-sm font-bold text-gray-800">{selectedTemplate.name}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Editor Mode</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Color Picker */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Theme</span>
               <div className="flex items-center gap-1.5">
                  <input 
                    type="color" 
                    value={activeColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-5 h-5 rounded-md cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">{activeColor}</span>
               </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              <button 
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-gray-500 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span className="text-[10px] font-black text-gray-600 min-w-[40px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-gray-500 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>

            <div className="h-6 w-px bg-gray-100" />

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700">Preview</button>
              <button 
                onClick={() => setShowSendModal(true)}
                className="px-5 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-orange-600 transition-all flex items-center gap-2"
              >
                <span>🚀</span> Send Template
              </button>
            </div>
          </div>
        </div>

        {/* Send Modal */}
        {showSendModal && (
          <SendEmailModal 
            template={{ ...selectedTemplate, color: activeColor }} 
            templateData={templateData}
            onClose={() => setShowSendModal(false)} 
          />
        )}

        {/* Editor Canvas Placeholder */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto custom-scrollbar flex justify-center items-start">
          <div 
            className="transition-transform duration-300 origin-top shadow-2xl"
            style={{ 
              transform: `scale(${zoom})`,
              width: "640px",
              marginBottom: "100px" // Space for bottom when scaled
            }}
          >
            {selectedTemplate.id === "confirm-1" ? (
               <BookingConfirmation 
                data={templateData["confirm-1"]} 
                isAdmin={true} 
                onUpdate={(field, val) => updateTemplateData("confirm-1", field, val)} 
                userPackages={userPackages}
                color={activeColor}
               />
            ) : selectedTemplate.id === "promo-1" ? (
               <WanderlustLuxury 
                data={templateData["promo-1"]} 
                isAdmin={true} 
                onUpdate={(field, val) => updateTemplateData("promo-1", field, val)} 
                userPackages={userPackages}
                color={activeColor}
               />

            ) : selectedTemplate.id === "promo-2" ? (
              <AzureTrails 
                data={templateData["promo-2"]} 
                isAdmin={true} 
                onUpdate={(field, val) => updateTemplateData("promo-2", field, val)} 
                userPackages={userPackages}
                color={activeColor}
              />
            ) : (
              <div className="w-full bg-white rounded-2xl min-h-[800px] border border-gray-100 flex flex-col overflow-hidden">
                {/* Template Header */}
                <div className="h-32 flex items-center justify-center border-b border-gray-50 text-3xl" style={{ backgroundColor: activeColor + "10" }}>
                  {selectedTemplate.thumbnail}
                </div>
                {/* Content areas */}
                <div className="p-10 space-y-6">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-10 bg-gray-50 rounded w-full" />
                    <div className="space-y-3">
                        <div className="h-3 bg-gray-50 rounded w-full" />
                        <div className="h-3 bg-gray-50 rounded w-5/6" />
                        <div className="h-3 bg-gray-50 rounded w-4/6" />
                    </div>
                    <div className="h-40 bg-gray-50 rounded-xl w-full border border-dashed border-gray-200 flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                        Drop images here
                    </div>
                </div>
                {/* Footer */}
                <div className="mt-auto p-10 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="h-2 bg-gray-200 rounded w-1/4" />
                    <p className="text-[10px] text-gray-300">© 2026 TravsPlatform. All rights reserved.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Template Browser View
  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Browser Header */}
      <div className="px-8 pt-8 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Email Templates</h2>
            <p className="text-sm text-gray-400 mt-1">Choose a baseline to start designing your email.</p>
          </div>
          <button className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors">
            + Custom Layout
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {EMAIL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className="group text-left bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-orange-400 hover:shadow-xl hover:shadow-orange-100 transition-all active:scale-[0.98]"
            >
              <div 
                className="h-40 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: template.color + "08" }}
              >
                {template.thumbnail}
              </div>
              <div className="p-5 border-t border-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-800 text-sm">{template.name}</h4>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.color }} />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
          
          {/* Create Empty Placeholder */}
          <button className="rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-10 gap-3 group hover:border-orange-300 transition-colors">
             <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xl text-gray-300 group-hover:text-orange-400 transition-colors">+</div>
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Start from scratch</p>
          </button>
        </div>
      </div>
    </div>
  );
}
