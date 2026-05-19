// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PageProvider } from "./context/PageContext";
import AdminPage from "./pages/AdminPage";
import ViewPage from "./pages/ViewPage";
import HomePage from "./pages/HomePage";

// Build Pages
import AboutPage from "./website-buildpage/AboutPage";
import BlogPage from "./website-buildpage/BlogPage";
import HelpPage from "./website-buildpage/HelpPage";
import ContactPage from "./website-buildpage/ContactPage";
import PrivacyPage from "./website-buildpage/PrivacyPage";
import TermsPage from "./website-buildpage/TermsPage";

function PrivateRoute({ children, allowedRoles }) {
  const { currentUser, role, loading } = useAuth();
  
  if (loading) return null;

  if (!currentUser) {
    // Redirect to your main dashboard login
    window.location.href = "https://your-dashboard-url.com/login"; 
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
          <button 
            onClick={() => window.location.href = "https://your-dashboard-url.com"}
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
      <AuthProvider>
        <Routes>
          {/* Tool Selector Home Page */}
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["admin", "agent"]}>
                <HomePage />
              </PrivateRoute>
            }
          />

          {/* Admin dashboard – requires login */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin", "agent"]}>
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
      </AuthProvider>
    </BrowserRouter>
  );
}
