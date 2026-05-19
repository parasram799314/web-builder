// src/website-buildpage/ContactPage.jsx
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import ContactForm from "../components/ContactForm/ContactForm";
import EditableText from "../components/Common/EditableText";
import { usePageContext } from "../context/PageContext";

export default function ContactPage({ pageData, pageId, isAdmin, onPageClick }) {
  const { updateSubpageField } = usePageContext();
  const themeColor = pageData?.themeColor || "#E8960C";

  const content = pageData?.subpageContents?.contact || {
    title: "Get in Touch",
    subtitle: "Have a specific requirement or just want to say hi? We'd love to hear from you.",
    location: "Mumbai, MH, India",
    email: "support@travsplatform.com",
  };

  const handleSave = (field, val) => {
    updateSubpageField("contact", field, val);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        branding={pageData?.branding} 
        themeColor={themeColor} 
        extraPages={pageData?.extraPages || []} 
        pageId={pageId} 
        isAdmin={isAdmin}
        onPageClick={onPageClick}
      />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              <EditableText
                value={content.title}
                onSave={(val) => handleSave("title", val)}
                isAdmin={isAdmin}
              />
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              <EditableText
                value={content.subtitle}
                onSave={(val) => handleSave("subtitle", val)}
                isAdmin={isAdmin}
                multiline
              />
            </p>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">📍</div>
                 <span className="text-gray-600 font-medium">
                   <EditableText
                     value={content.location}
                     onSave={(val) => handleSave("location", val)}
                     isAdmin={isAdmin}
                   />
                 </span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">📧</div>
                 <span className="text-gray-600 font-medium">
                   <EditableText
                     value={content.email}
                     onSave={(val) => handleSave("email", val)}
                     isAdmin={isAdmin}
                   />
                 </span>
               </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <ContactForm isAdmin={false} themeColor={themeColor} />
          </div>
        </div>
      </main>
    </div>
  );
}
