// src/components/ContactForm/ContactForm.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePageContext } from "../../context/PageContext";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function ContactForm({ agentId: propAgentId, isAdmin }) {
  const { pageId } = useParams();
  const context = usePageContext();
  const { pageData, updateField } = context || { 
    pageData: { 
      contactFields: [
        { name: "name", label: "Your Name", type: "text", enabled: true },
        { name: "email", label: "Email Address", type: "email", enabled: true },
        { name: "phone", label: "Phone Number", type: "tel", enabled: true },
        { name: "message", label: "Message/Query", type: "textarea", enabled: true },
      ] 
    },
    updateField: () => {}
  };
  const agentId = propAgentId || pageId;

  const fields = pageData.contactFields || [];
  const themeColor = pageData.themeColor || "#E8960C";

  const toggleField = (index) => {
    if (!context) return;
    const updated = [...fields];
    updated[index].enabled = !updated[index].enabled;
    updateField("contactFields", updated);
  };

  const handleLabelChange = (index, newLabel) => {
    if (!context) return;
    const updated = [...fields];
    updated[index].label = newLabel;
    updateField("contactFields", updated);
  };

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setError("Name and Email are required");
      return;
    }
    if (!agentId) {
      setError("Agent ID is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/contact/${agentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.error || "Failed to submit inquiry");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 13,
    color: "#374151",
    outline: "none",
    background: "#fff",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-bold text-gray-800 mb-3 text-sm">
        {isAdmin ? "Edit Contact Form" : "Contact Form"}
      </h3>
      <div className="flex flex-col gap-3">
        {error && <p className="text-red-500 text-xs mb-1">{error}</p>}
        {fields.map((field, idx) => (
          <div key={field.name} className={`flex flex-col gap-1 ${!field.enabled && isAdmin ? "opacity-50" : ""}`}>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.enabled}
                  onChange={() => toggleField(idx)}
                  style={{ accentColor: themeColor }}
                />
                <input
                  className="text-xs font-semibold text-gray-700 bg-gray-50 border-b border-gray-300 outline-none flex-1"
                  value={field.label}
                  onChange={(e) => handleLabelChange(idx, e.target.value)}
                />
              </div>
            ) : (
              field.enabled && <label className="text-xs font-semibold text-gray-700">{field.label}</label>
            )}
            
            {field.enabled && (field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                rows={4}
                style={{ ...inputStyle, resize: "none" }}
                disabled={loading || isAdmin}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                style={inputStyle}
                disabled={loading || isAdmin}
              />
            ))}
          </div>
        ))}

        {!isAdmin && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ background: submitted ? "#22c55e" : themeColor, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : submitted ? (
              "✓ Inquiry Sent!"
            ) : (
              "Submit Inquiry"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
