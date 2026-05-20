// src/components/Admin/MyLinksModal.jsx
import React, { useEffect, useState } from "react";
import { usePageContext } from "../../context/PageContext";

export default function MyLinksModal({ toolMode, onClose }) {
  const [loading, setLoading] = useState(false);
  const context = usePageContext();
  const allPages = context?.allPages || [];
  const loadPage = context?.loadPage;
  const deletePage = context?.deletePage;
  const currentPageId = context?.currentPageId;
  const fetchAllPages = context?.fetchAllPages;

  useEffect(() => {
    const init = async () => {
      try {
        if (fetchAllPages) {
          setLoading(true);
          await fetchAllPages(toolMode);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in MyLinksModal init:", err);
        setLoading(false);
      }
    };
    init();
  }, [fetchAllPages, toolMode]);

  const handleSelect = (id) => {
    if (id === currentPageId) { onClose(); return; }
    // Warn if there are unsaved changes on current page
    const isDirty = context?.isDirty;
    if (isDirty) {
      const confirmed = window.confirm(
        "Aapke current page mein unsaved changes hain. Kya aap bina save kiye dusra page load karna chahte hain?\n\nOK = Discard & Load\nCancel = Yahan raho"
      );
      if (!confirmed) return;
    }
    loadPage(id, toolMode);
    onClose();
  };

  const handleCopy = (e, url) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this link?")) {
      deletePage(id, toolMode);
    }
  };

  const externalSiteUrl = process.env.REACT_APP_EXTERNAL_SITE || window.location.origin;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-7 relative max-h-[80vh] flex flex-col">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {toolMode === "calendar" ? "My Calendar Links" : "My Website Links"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {toolMode === "calendar" 
            ? "Yahan aapke saare published calendars ki list hai." 
            : "Yahan aapke saare published websites ki list hai."}
        </p>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm">Fetching your links...</p>
            </div>
          ) : allPages.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">No pages found. Create your first page!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {allPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  className={`group relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    currentPageId === page.id ? "border-orange-400 bg-orange-50/30" : "border-gray-100 hover:border-orange-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-black text-gray-800 truncate">
                        {typeof page.pageName === "string" 
                          ? page.pageName 
                          : (page.pageName?.branding?.value || "Untitled Page")}
                      </h3>
                      {page.isPublished && (
                        <span className="bg-green-100 text-green-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-green-200">Live</span>
                      )}
                    </div>

                    <div className="grid gap-2 pr-4">
                      {/* Show ONLY the link for the current toolMode */}
                      {toolMode === "website" ? (
                        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-2 group/link hover:border-orange-200">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-[10px] font-black text-orange-600 uppercase bg-orange-50 px-1.5 py-0.5 rounded shrink-0">Website Link</span>
                            <p className="text-[11px] text-gray-400 truncate font-mono">
                              {externalSiteUrl}/view/{page.id}?mode=website
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`${externalSiteUrl}/view/${page.id}?mode=website`, "_blank");
                              }}
                              className="p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                            </button>
                            <button
                              onClick={(e) => handleCopy(e, `${externalSiteUrl}/view/${page.id}?mode=website`)}
                              className="p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-2 group/link hover:border-blue-200">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-1.5 py-0.5 rounded shrink-0">Calendar Link</span>
                            <p className="text-[11px] text-gray-400 truncate font-mono">
                              {externalSiteUrl}/view/{page.id}?mode=calendar
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`${externalSiteUrl}/view/${page.id}?mode=calendar`, "_blank");
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                            </button>
                            <button
                              onClick={(e) => handleCopy(e, `${externalSiteUrl}/view/${page.id}?mode=calendar`)}
                              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, page.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}