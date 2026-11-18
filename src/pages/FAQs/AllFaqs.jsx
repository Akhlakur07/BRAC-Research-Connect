import React, { useEffect, useMemo, useState } from "react";
import { Search, HelpCircle } from "lucide-react";

const AllFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/faqs`
        );
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const data = await res.json();
        setFaqs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Error fetching FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  return (
    <main className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Help Center
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900">
            Frequently Asked <span className="text-brand-600">Questions</span>
          </h1>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Quick answers about thesis registration, supervisors, and the portal.
          </p>
          <div className="relative max-w-lg mx-auto mt-8">
            <Search className="w-5 h-5 text-brand-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-brand-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-center text-slate-500">Loading FAQs...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : !filtered.length ? (
          <p className="text-center text-slate-500">No FAQs found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((faq) => (
              <div
                key={faq._id}
                className="bg-white p-6 rounded-2xl border border-brand-100 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-brand-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                    Q
                  </div>
                  <h3 className="font-bold font-display text-base text-slate-900 leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-12">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AllFaqs;
