import React, { useState } from "react";

const CreateFaqs = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      setMessage("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/faqs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        }
      );

      if (res.ok) {
        setMessage("FAQ added successfully!");
        setQuestion("");
        setAnswer("");
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to add FAQ");
      }
    } catch {
      setMessage("Error adding FAQ");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="max-w-lg mx-auto p-6 sm:p-10 bg-white border border-brand-100 shadow-xl shadow-brand-100/60 rounded-3xl animate-fade-up">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-6">Create FAQ</h2>
          {message && <p className="mb-4 px-4 py-3 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter FAQ question"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter FAQ answer"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-brand-200 transition"
            >
              Add FAQ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFaqs;
