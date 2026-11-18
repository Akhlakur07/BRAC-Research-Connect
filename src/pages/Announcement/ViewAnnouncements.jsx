import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API_BASE}/announcements`);
        if (!res.ok) throw new Error("Failed to fetch announcements");
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <p className="p-6 text-center text-slate-500">Loading announcements...</p>;

  if (announcements.length === 0)
    return <p className="p-6 text-center text-slate-500">No announcements available.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 animate-fade-up">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-8 text-slate-900">
          Announcements
        </h1>
        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="p-6 border border-brand-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-display text-xl font-bold text-slate-900">
                {a.title}
              </h2>
              <p className="text-brand-600 text-xs font-semibold uppercase tracking-wide mt-1 mb-3">
                Posted on {new Date(a.createdAt).toLocaleDateString()}
              </p>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAnnouncements;
