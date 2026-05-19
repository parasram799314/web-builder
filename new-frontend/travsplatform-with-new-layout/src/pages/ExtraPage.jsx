// src/pages/ExtraPage.jsx
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Link } from "react-router-dom";

// Import real components for each page type
import AboutPage from "../website-buildpage/AboutPage";
import BlogPage from "../website-buildpage/BlogPage";
import HelpPage from "../website-buildpage/HelpPage";
import ContactPage from "../website-buildpage/ContactPage";
import PrivacyPage from "../website-buildpage/PrivacyPage";
import TermsPage from "../website-buildpage/TermsPage";

const PAGE_CONTENT = {
  about: {
    title: "About Us",
    component: AboutPage
  },
  blog: {
    title: "Travel Blog",
    component: BlogPage
  },
  help: {
    title: "Help Center",
    component: HelpPage
  },
  contact_page: {
    title: "Contact Us",
    component: ContactPage
  },
  privacy: {
    title: "Privacy Policy",
    component: PrivacyPage
  },
  terms: {
    title: "Terms & Conditions",
    component: TermsPage
  }
};

export default function ExtraPage({ type, pageData, pageId, isAdmin, onPageClick }) {
  const pageEntry = PAGE_CONTENT[type];
  const themeColor = pageData?.themeColor || "#E8960C";
  const homeUrl = pageId ? `/view/${pageId}` : "/";

  // If we have a full-blown component for this page type, use it!
  if (pageEntry?.component) {
    const Component = pageEntry.component;
    return (
       <div className="min-h-screen flex flex-col">
          {/* Ensure navbar is present or handled within the component */}
          <Component 
            pageData={pageData} 
            pageId={pageId} 
            isAdmin={isAdmin} 
            onPageClick={onPageClick} 
          />
       </div>
    );
  }

  // Fallback for types we don't have a component for
  const data = { title: "Page Not Found", content: "The requested page does not exist." };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        branding={pageData?.branding} 
        themeColor={themeColor} 
        extraPages={pageData?.extraPages} 
        pageId={pageId} 
        isAdmin={isAdmin}
        onPageClick={onPageClick}
      />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.title}
          </h1>
          <div className="w-20 h-1.5 rounded-full mb-10 mx-auto" style={{ background: themeColor }} />
          <p className="text-gray-600 mb-10">{data.content}</p>
          <Link to={homeUrl} className="text-sm font-bold inline-flex items-center gap-2" style={{ color: themeColor }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
