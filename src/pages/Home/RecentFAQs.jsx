import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

const RecentFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/faqs`
        );
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const data = await res.json();
        setFaqs(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        setError(err.message || "Error fetching FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading FAQs..." />;
  }
  if (error) {
    return (
      <div className="py-12 text-center text-brand-700 text-sm">{error}</div>
    );
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-3">
            Common Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            Recent <span className="text-brand-600">FAQs</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="bg-white p-6 rounded-2xl border border-brand-100 shadow-xs hover:shadow-md hover:border-brand-200 transition-all duration-200"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-brand-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  Q
                </div>
                <h3 className="font-bold font-display text-base text-slate-900 leading-snug">
                  {faq.question}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/all-faqs")}
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition font-semibold text-sm shadow-xs cursor-pointer"
          >
            View All FAQs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentFAQs;
