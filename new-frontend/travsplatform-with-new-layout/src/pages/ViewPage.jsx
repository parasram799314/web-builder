// src/pages/ViewPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Calendar from "../components/Calendar/Calendar";
import PackagesList from "../components/Packages/PackagesList";
import RightPanel from "../components/RightPanel/RightPanel";
import { getLayoutById } from "../layouts/index";
import ExtraPage from "./ExtraPage";

export default function ViewPage() {
  const { pageId, subPage: subPageParam } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const viewMode = queryParams.get("mode") || "website";
  const subPage = subPageParam || queryParams.get("subPage");

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [visitCountry, setVisitCountry] = useState("india");

  // --- Scroll to top on navigation ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  // Load data - run once per pageId
  useEffect(() => {
    const load = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_BASE}/pages/view/${pageId}`);
       
        const data = await response.json();
        if (response.ok && data.page) {
          // FIX: Ensure extraPages is always an array even if missing from published snapshot
          const pageWithDefaults = {
            extraPages: [],
            ...data.page,
          };
          setPageData(pageWithDefaults);
          if (pageWithDefaults.countries?.length > 0) {
            setVisitCountry(pageWithDefaults.countries[1] || pageWithDefaults.countries[0]);
          }
        } else {
          setNotFound(true);
        }
      } catch (e) {
        setNotFound(true);
      }
      setLoading(false);
    };
    load();
  }, [pageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-500 text-sm">
            This travel page doesn't exist or hasn't been published yet.
          </p>
        </div>
      </div>
    );
  }

  // Handle Extra Pages - Use key to force re-mount when switching between subpages
  if (subPage) {
    return <ExtraPage key={subPage} type={subPage} pageData={pageData} pageId={pageId} />;
  }

  // If a custom layout is selected, render that layout
  const activeLayoutId = pageData?.activeLayout || "ModernTravel";
  const layoutEntry = getLayoutById(activeLayoutId);
  
  if (viewMode !== "calendar" && layoutEntry?.Layout) {
    const LayoutComponent = layoutEntry.Layout;
    return (
      <div className="min-h-screen">
        <LayoutComponent
          draftData={pageData}
          agentId={pageId}
        />
      </div>
    );
  }

  // Fallback for very old data or if getLayoutById fails
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar 
        branding={pageData?.branding} 
        themeColor={pageData?.themeColor} 
        extraPages={pageData?.extraPages} 
        pageId={pageId}
      />
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-gray-200 flex flex-col bg-white p-4 gap-4 overflow-y-auto custom-scrollbar">
          {viewMode === "calendar" ? (
            <RightPanel isAdmin={false} part="bottom" countries={pageData?.countries || ["india"]} showContactForm={pageData?.showContactForm !== false} />
          ) : (
            <RightPanel isAdmin={false} part="top" countries={pageData?.countries || ["india"]} />
          )}
        </aside>

        {/* Center Content */}
        <section className="flex-1 flex flex-col min-w-0 overflow-hidden border-r border-gray-200 bg-gray-100">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <Calendar 
                  selectedCountries={pageData?.countries || ["india"]} 
                  isAdmin={false} 
                  visitCountry={visitCountry}
                  setVisitCountry={setVisitCountry}
                  calendarTheme={pageData?.calendarTheme}
                />
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <PackagesList 
                  isAdmin={false} 
                  packages={pageData?.packages || []} 
                  visitCountry={visitCountry}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        {viewMode !== "calendar" && (
          <aside className="w-72 flex flex-col bg-white p-4 overflow-y-auto custom-scrollbar">
            <RightPanel isAdmin={false} part="bottom" countries={pageData?.countries || ["india"]} showContactForm={pageData?.showContactForm !== false} />
          </aside>
        )}
      </main>
    </div>
  );
}