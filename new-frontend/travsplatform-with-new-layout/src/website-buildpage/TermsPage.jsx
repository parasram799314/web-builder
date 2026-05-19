// src/website-buildpage/TermsPage.jsx
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import EditableText from "../components/Common/EditableText";
import { usePageContext } from "../context/PageContext";

export default function TermsPage({ pageData, pageId, isAdmin, onPageClick }) {
  const { updateSubpageField } = usePageContext();
  const themeColor = pageData?.themeColor || "#E8960C";

  const content = pageData?.subpageContents?.terms || {
    title: "Terms & Conditions",
    intro: "Please read these terms and conditions carefully before using our service.",
  };

  const handleSave = (field, val) => {
    updateSubpageField("terms", field, val);
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
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20">
        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            <EditableText
              value={content.title}
              onSave={(val) => handleSave("title", val)}
              isAdmin={isAdmin}
            />
          </h1>
          <div className="prose prose-slate max-w-none text-gray-500 leading-relaxed space-y-6">
            <p>
              <EditableText
                value={content.intro}
                onSave={(val) => handleSave("intro", val)}
                isAdmin={isAdmin}
                multiline
              />
            </p>
            <h3 className="text-xl font-bold text-gray-800">1. Acceptance of Terms</h3>
            <p>By accessing this website, you are agreeing to be bound by these web site Terms and Conditions of Use.</p>
            <h3 className="text-xl font-bold text-gray-800">2. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials on TravPlatforms's web site for personal, non-commercial transitory viewing only.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
