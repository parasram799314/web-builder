// src/App.js
import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PageProvider } from "./context/PageContext";

// Lazy Load Pages
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ViewPage = lazy(() => import("./pages/ViewPage"));
const HomePage = lazy(() => import("./pages/HomePage"));

// Lazy Load Build Pages
const AboutPage = lazy(() => import("./website-buildpage/AboutPage"));
const BlogPage = lazy(() => import("./website-buildpage/BlogPage"));
const HelpPage = lazy(() => import("./website-buildpage/HelpPage"));
const ContactPage = lazy(() => import("./website-buildpage/ContactPage"));
const PrivacyPage = lazy(() => import("./website-buildpage/PrivacyPage"));
const TermsPage = lazy(() => import("./website-buildpage/TermsPage"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 font-medium text-sm animate-pulse">Waking up the engine...</p>
    </div>
  </div>
);

function BackendWarmer() {
  useEffect(() => {
    // Ping backend early to wake it up if it's on Render/Railway/Heroku free tier
    const API_URL = process.env.REACT_APP_API_URL;
    if (API_URL) {
      // Just a simple HEAD or GET request to a health endpoint
      fetch(`${API_URL.replace('/api', '')}/health`, { mode: 'no-cors' }).catch(() => {});
    }
  }, []);
  return null;
}

function PrivateRoute({ children, allowedRoles }) {
  const { currentUser, role, loading } = useAuth();
  
  console.log("PrivateRoute Render - Loading:", loading, "Role:", role, "User:", currentUser?.email);

  // Show loading while checking auth status OR if user exists but role isn't loaded yet
  if (loading || (currentUser && allowedRoles && role === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h1>
          <p className="text-gray-600 mb-6">Please log in from your dashboard to access this tool.</p>
          <button 
            onClick={() => {
              const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || "#";
              if (dashboardUrl !== "#") window.location.href = dashboardUrl;
            }}
            className="w-full bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-bold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(role) && role !== "admin" && role !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
          <button 
            onClick={() => {
              const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL;
    if (!dashboardUrl) {
      console.error("REACT_APP_DASHBOARD_URL is missing!");
      return null;
    }
              window.location.href = dashboardUrl;
            }}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <BackendWarmer />
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Tool Selector Home Page */}
            <Route
              path="/"
              element={
                <PrivateRoute allowedRoles={["admin", "agent", "user"]}>
                  <HomePage />
                </PrivateRoute>
              }
            />

            {/* Admin dashboard – requires login */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin", "agent", "user"]}>
                  <PageProvider>
                    <AdminPage />
                  </PageProvider>
                </PrivateRoute>
              }
            />

            {/* Public read-only client view - supports subpages as path segments or query params */}
            <Route 
              path="/view/:pageId/:subPage?" 
              element={
                <PageProvider>
                  <ViewPage />
                </PageProvider>
              } 
            />

            {/* Standalone pages (Platform level or fallback) */}
            <Route path="/about" element={<PageProvider><AboutPage /></PageProvider>} />
            <Route path="/blog" element={<PageProvider><BlogPage /></PageProvider>} />
            <Route path="/help" element={<PageProvider><HelpPage /></PageProvider>} />
            <Route path="/contact" element={<PageProvider><ContactPage /></PageProvider>} />
            <Route path="/privacy" element={<PageProvider><PrivacyPage /></PageProvider>} />
            <Route path="/terms" element={<PageProvider><TermsPage /></PageProvider>} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
