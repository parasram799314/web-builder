// src/context/PageContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { DEFAULT_PACKAGES } from "../data/holidays";
import axiosInstance from "../utils/axiosConfig";

const PageContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL;

const DEFAULT_PAGE_DATA = {
  branding: { type: "text", value: "travsplatform" },
  hero: {
    title: "Discover Your Next Adventure",
    subtitle: "Smart travel planning with holiday calendars, curated packages, and exclusive deals.",
    buttonText: "Search"
  },
  sections: {
    destinations: { title: "Trending Destinations", subtitle: "Explore" },
    packages: { title: "Smart Package Picks", subtitle: "Curated For You" },
    calendar: { title: "Holiday Calendar & Contact", subtitle: "Plan Smart" },
  },
  countries: ["india"],
  packages: DEFAULT_PACKAGES,
  selectedCalendars: ["full", "long"],
  showContactForm: true,
  contactFields: [
    { name: "name", label: "Your Name", type: "text", enabled: true },
    { name: "email", label: "Email Address", type: "email", enabled: true },
    { name: "phone", label: "Phone Number", type: "tel", enabled: true },
    { name: "message", label: "Message/Query", type: "textarea", enabled: true },
  ],
  themeColor: "#E8960C",
  widgets: ["destinations", "flights", "hotels", "packages", "calendar", "contact"],
  hiddenWidgets: [],
  flightMargin: 10,
  hotelMargin: 15,
  activeLayout: "ModernTravel",
  calendarTheme: "classic",
  extraPages: [],
  subpageContents: {
    about: {
      heroBadge: "Our Story",
      heroTitle: "Crafting Journeys, Creating Memories",
      heroSubtitle: "Since 2018, we've been redefining travel — turning ordinary trips into extraordinary adventures for thousands of travelers worldwide.",
      missionBadge: "Our Mission",
      missionTitle: "Seamless. Personal. Unforgettable.",
      missionDesc: "To provide seamless, personalized, and unforgettable travel experiences that connect people with cultures, landscapes, and communities around the world.",
      visionBadge: "Our Vision",
      visionTitle: "The World's Most Trusted Platform",
      visionDesc: "To become the world's most trusted platform for intelligent travel planning — where every journey is shaped by data, care, and human connection.",
      mosaicBadge: "Where We've Been",
      mosaicTitle: "The World Through Our Lens",
      valuesBadge: "What Drives Us",
      valuesTitle: "Our Core Values",
      journeyBadge: "How We Got Here",
      journeyTitle: "Our Journey",
      teamBadge: "The People",
      teamTitle: "Meet the Team",
      ctaBadge: "Ready to Explore?",
      ctaTitle: "Your Next Adventure Awaits",
      ctaDesc: "Browse 500+ destinations, smart packages, and let us plan the perfect trip tailored just for you.",
    },
    blog: {
      heroBadge: "Travel Stories & Insights",
      heroTitle: "Stories That Inspire Your Next Journey",
      heroSubtitle: "Curated travel stories, destination guides, and insider tips from explorers around the world.",
      featuredBadge: "Featured Story",
      featuredTitle: "Editor's Pick",
      categoryBadge: "Browse by Category",
      categoryTitle: "Latest Articles",
      newsletterBadge: "Newsletter",
      newsletterTitle: "Never Miss a Story",
      newsletterDesc: "Get the latest travel guides, destination spotlights, and exclusive deals delivered to your inbox every week.",
    },
    help: {
      heroBadge: "Help Center",
      heroTitle: "How can we help you today?",
      heroSubtitle: "Find answers to frequently asked questions, detailed guides, and support resources for your next adventure.",
      categoryBadge: "Knowledge Base",
      categoryTitle: "Browse by Category",
      faqBadge: "FAQ",
      faqTitle: "Frequently Asked Questions",
      contactBadge: "Still need help?",
      contactTitle: "We're here for you",
      contactDesc: "Can't find what you're looking for? Our support team is available 24/7 to assist with your travel plans.",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Have a specific requirement or just want to say hi? We'd love to hear from you.",
      location: "Mumbai, MH, India",
      email: "support@travsplatform.com",
    },
    privacy: {
      heroTitle: "Privacy Policy",
      heroSubtitle: "Last updated: April 21, 2026 · Effective immediately",
      introText: "At travsplatform, your privacy is not an afterthought — it is a fundamental part of how we build our products. This Privacy Policy explains what data we collect, why we collect it, and how you remain in control at every step of your journey with us.",
    },
    terms: {
      title: "Terms & Conditions",
      intro: "Please read these terms and conditions carefully before using our service.",
    },
  },
  published: false,
};

export function PageProvider({ children }) {
  const { currentUser } = useAuth();

  const [allPages, setAllPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [draftData, setDraftData] = useState(DEFAULT_PAGE_DATA);
  const [publishedData, setPublishedData] = useState(DEFAULT_PAGE_DATA);
  const [pageName, setPageName] = useState("Untitled Page");

  // Use Refs to avoid stale closures in saveDraft when called from timeouts
  const draftRef = React.useRef(draftData);
  const nameRef = React.useRef(pageName);
  React.useEffect(() => { draftRef.current = draftData; }, [draftData]);
  React.useEffect(() => { nameRef.current = pageName; }, [pageName]);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);

  // --- GLOBAL PACKAGES LOGIC ---
  const fetchGlobalPackages = useCallback(async () => {
    if (!currentUser) return;
    try {
      const response = await axiosInstance.get("/packages");
      if (response.data && response.data.packages) {
        // Only update draftData with global packages if we don't have local packages yet 
        // or if we are explicitly initializing/syncing
        setDraftData(prev => ({ 
          ...prev, 
          packages: response.data.packages.length > 0 ? response.data.packages : prev.packages 
        }));
      }
    } catch (e) {
      console.error("Error fetching global packages:", e);
    }
  }, [currentUser]);

  const addGlobalPackage = async (pkg) => {
    if (!currentUser) return;
    try {
      const response = await axiosInstance.post("/packages", pkg);
      if (response.status === 200 || response.status === 201) fetchGlobalPackages();
    } catch (e) { console.error(e); }
  };

  const updateGlobalPackage = async (pkgId, updates) => {
    if (!currentUser) return;
    try {
      const response = await axiosInstance.put(`/packages/${pkgId}`, updates);
      if (response.status === 200) fetchGlobalPackages();
    } catch (e) { console.error(e); }
  };

  const deleteGlobalPackage = async (pkgId) => {
    if (!currentUser) return;
    try {
      const response = await axiosInstance.delete(`/packages/${pkgId}`);
      if (response.status === 200) fetchGlobalPackages();
    } catch (e) { console.error(e); }
  };

  // --- PAGE LOGIC ---
  const fetchAllPages = useCallback(async (type = "website") => {
    if (!currentUser) return;
    try {
      const response = await axiosInstance.get(`/pages?type=${type}`);
      if (response.data) setAllPages(response.data.pages || []);
    } catch (e) {
      console.error("Error fetching all pages:", e);
    }
  }, [currentUser]);

  const loadPage = useCallback(async (pageId, type = "website") => {
    if (!currentUser) return;
    setLoadingPage(true);
    try {
      const response = await axiosInstance.get(`/pages/${pageId}?type=${type}`);
      const data = response.data;
      if (data && data.page) {
        const draft = data.page.draft || DEFAULT_PAGE_DATA;
        const published = data.page.publishedVersion || DEFAULT_PAGE_DATA;
        setDraftData({ ...DEFAULT_PAGE_DATA, ...draft });
        setPublishedData({ ...DEFAULT_PAGE_DATA, ...published, published: data.page.isPublished || false });
        setCurrentPageId(data.page.id);
        const loadedName = data.page.pageName;
        setPageName(typeof loadedName === "string" ? loadedName : (loadedName?.branding?.value || "Untitled Page"));
        // After loading a page, sync with global packages
        await fetchGlobalPackages();
      }
    } catch (e) {
      console.error("Error loading page:", e);
    }
    setLoadingPage(false);
  }, [currentUser, fetchGlobalPackages]);

  const updateField = useCallback((key, value) => {
    setDraftData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateSubpageField = useCallback((subpage, field, value) => {
    setDraftData((prev) => ({
      ...prev,
      subpageContents: {
        ...prev.subpageContents,
        [subpage]: {
          ...(prev.subpageContents?.[subpage] || {}),
          [field]: value
        }
      }
    }));
  }, []);

  const saveDraft = useCallback(
    async (customName, dataOverride, pageType = "website") => {
      if (!currentUser) return null;
      setSaving(true);
      // Use ref for name and data if not explicitly provided to avoid stale closures
      let nameToSave = customName || nameRef.current;
      if (typeof nameToSave !== "string") nameToSave = nameToSave?.branding?.value || "Untitled Page";
      const dataToSave = dataOverride || draftRef.current;
      try {
        const response = await axiosInstance.put("/pages/save", { 
          ...dataToSave, 
          pageId: currentPageId, 
          pageName: nameToSave, 
          pageType 
        });
        const result = response.data;
        if (response.status === 200) {
          if (!currentPageId) setCurrentPageId(result.pageId);
          setPageName(nameToSave);
          setSaveMsg("Saved!");
          fetchAllPages(pageType);
          setTimeout(() => setSaveMsg(""), 2500);
          return result.pageId;
        } else {
          setSaveMsg(result.error || "Error saving.");
        }
      } catch (e) {
        setSaveMsg("Error saving.");
        console.error(e);
      } finally { setSaving(false); }
      return null;
    },
    [currentUser, currentPageId, fetchAllPages]
  );

  const publishPage = useCallback(
    async (customName, pageType = "website") => {
      if (!currentUser) return;
      setPublishing(true);
      try {
        const id = await saveDraft(customName, null, pageType);
        const finalId = id || currentPageId;
        if (!finalId) throw new Error("Could not determine Page ID");
        
        const response = await axiosInstance.post(`/pages/publish/${finalId}`, { 
          pageName: customName || pageName, 
          pageType 
        });
        
        if (response.status === 200) {
          setPublishedData({ ...draftData, published: true });
          setSaveMsg("Published! 🎉");
          fetchAllPages(pageType);
          setTimeout(() => setSaveMsg(""), 3000);
          return true;
        } else {
          const result = response.data;
          setSaveMsg(result.error || "Publish failed.");
          return false;
        }
      } catch (e) {
        setSaveMsg("Error publishing.");
        console.error(e);
        return false;
      } finally { setPublishing(false); }
    },
    [currentUser, draftData, saveDraft, currentPageId, pageName, fetchAllPages]
  );

  const deletePage = useCallback(async (pageId, type = "website") => {
    if (!currentUser) return;
    try {
      const response = await axiosInstance.delete(`/pages/${pageId}?type=${type}`);
      if (response.status === 200) {
        if (currentPageId === pageId) {
          setCurrentPageId(null);
          setDraftData(DEFAULT_PAGE_DATA);
          setPageName("Untitled Page");
        }
        fetchAllPages(type);
      }
    } catch (e) { console.error("Error deleting page:", e); }
  }, [currentUser, currentPageId, fetchAllPages]);

  const createNewPage = useCallback((skipDirtyCheck = false) => {
    // Warn user if there are unsaved changes on the current page
    if (!skipDirtyCheck && currentPageId) {
      const currentDirty = JSON.stringify(draftData) !== JSON.stringify(publishedData);
      if (currentDirty) {
        const confirmed = window.confirm(
          "Aapke current page mein unsaved changes hain. Kya aap bina save kiye naya page banana chahte hain?\n\n" +
          "OK = Discard changes & New Page\nCancel = Current page par raho"
        );
        if (!confirmed) return false; // cancelled
      }
    }
    setCurrentPageId(null);
    setDraftData(DEFAULT_PAGE_DATA);
    setPublishedData(DEFAULT_PAGE_DATA);
    setPageName("New Page");
    fetchGlobalPackages();
    return true;
  }, [fetchGlobalPackages, currentPageId, draftData, publishedData]);

  useEffect(() => {
    if (!currentUser) { setLoadingPage(false); return; }
    const init = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get("tool") || "website";
      await Promise.all([fetchAllPages(mode), fetchGlobalPackages()]);
      setLoadingPage(false);
    };
    init();
  }, [currentUser, fetchAllPages, fetchGlobalPackages]);

  const isDirty = JSON.stringify(draftData) !== JSON.stringify(publishedData);

  return (
    <PageContext.Provider
      value={{
        pageData: draftData,
        draftData,
        publishedData,
        currentPageId,
        allPages,
        pageName,
        setPageName,
        saveDraft,
        publishPage,
        deletePage,
        loadPage,
        createNewPage,
        fetchAllPages,
        fetchGlobalPackages,
        addGlobalPackage,
        updateGlobalPackage,
        deleteGlobalPackage,
        saving,
        publishing,
        saveMsg,
        loadingPage,
        updateField,
        updateSubpageField,
        isDirty,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}