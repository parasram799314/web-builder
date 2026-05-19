// src/components/Admin/InquiriesList.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function InquiriesList() {
  const { currentUser } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInquiries = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/contact/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(data.inquiries || []);
      } else {
        setError(data.error || "Failed to load inquiries");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchInquiries();
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/contact/inquiries/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, read: true } : inq))
        );
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) return <p className="text-xs text-gray-500">Loading inquiries...</p>;
  if (error) return <p className="text-xs text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
          Recent Inquiries
        </h3>
        <button 
          onClick={fetchInquiries}
          className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        {inquiries.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 italic">
            No inquiries yet.
          </p>
        ) : (
          inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-3 rounded-lg border transition-colors ${
                inq.read ? "bg-gray-50 border-gray-100" : "bg-orange-50/30 border-orange-100"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold text-gray-800">{inq.name}</p>
                {!inq.read && (
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                )}
              </div>
              <p className="text-[11px] text-gray-600 mb-1">{inq.email}</p>
              {inq.phone && <p className="text-[10px] text-gray-400 mb-1">{inq.phone}</p>}
              <p className="text-xs text-gray-700 bg-white/50 p-2 rounded border border-gray-100 mt-2 italic">
                "{inq.message}"
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                  {inq.submittedAt ? new Date(inq.submittedAt).toLocaleDateString() : ""}
                </span>
                {!inq.read && (
                  <button
                    onClick={() => markAsRead(inq.id)}
                    className="text-[10px] text-orange-600 font-bold hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
