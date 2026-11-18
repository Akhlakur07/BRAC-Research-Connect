import React, { useContext, useEffect, useState, useMemo } from "react";
import { useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  FileText,
  Check,
  X,
  Link as LinkIcon,
  Send,
  Calendar,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ViewRecievedProposals = () => {
  const { user } = useContext(AuthContext);
  const data = useLoaderData();

  const dbUser = useMemo(
    () => data?.find?.((u) => u.email === user?.email) || null,
    [data, user?.email]
  );
  const supervisorId = dbUser?._id ? String(dbUser._id) : null;

  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [acting, setActing] = useState({});
  const [error, setError] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState({});

  // Semester selection modal state
  const [semesters, setSemesters] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveForProposalId, setApproveForProposalId] = useState(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const upcomingSemesters = useMemo(() => {
    // Safety filter client-side too: hide startDate <= today
    return (semesters || []).filter((s) => s.startDate > todayStr);
  }, [semesters, todayStr]);

  const fetchProposals = async () => {
    if (!supervisorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/proposals?supervisorId=${supervisorId}`
      );
      if (!res.ok) throw new Error("Failed to fetch proposals");
      const d = await res.json();
      setProposals(Array.isArray(d) ? d : []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to fetch proposals");
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingSemesters = async () => {
    try {
      const res = await fetch(`${API_BASE}/semesters/upcoming`);
      if (!res.ok) throw new Error("Failed to load semesters");
      const list = await res.json();
      setSemesters(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Load semesters error:", e);
      setSemesters([]);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [supervisorId]);

  useEffect(() => {
    // Preload upcoming semesters so the modal opens instantly
    fetchUpcomingSemesters();
  }, []);

  const openApproveModal = (proposalId) => {
    setApproveForProposalId(proposalId);
    setSelectedSemesterId("");
    setShowApproveModal(true);
  };

  const closeApproveModal = () => {
    setShowApproveModal(false);
    setApproveForProposalId(null);
    setSelectedSemesterId("");
  };

  const decide = async (proposalId, decision, semesterId) => {
    if (!supervisorId) return;
    setActing((p) => ({ ...p, [proposalId]: true }));
    try {
      const res = await fetch(`${API_BASE}/proposals/${proposalId}/decision`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId, decision, semesterId }),
      });
      const data = await res.json();

      if (!res.ok) {
        // surface cap / validation messages cleanly
        const msg =
          data?.message ||
          (res.status === 409
            ? "Youâ€™ve reached the maximum of 8 groups for this semester."
            : "Failed to update proposal");
        throw new Error(msg);
      }

      setProposals((prev) =>
        prev.map((p) =>
          String(p._id) === String(proposalId) ? data.proposal : p
        )
      );

      if (decision === "approve") {
        alert("Proposal approved and starting semester assigned.");
      } else {
        alert("Proposal rejected successfully.");
      }
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to update proposal");
    } finally {
      setActing((p) => ({ ...p, [proposalId]: false }));
    }
  };

  const sendFeedback = async (proposalId) => {
    if (!supervisorId) return;
    const text = feedbackDraft[proposalId];
    if (!text || !text.trim()) {
      alert("Feedback cannot be empty");
      return;
    }
    setActing((p) => ({ ...p, [proposalId]: true }));
    try {
      const res = await fetch(`${API_BASE}/proposals/${proposalId}/feedback`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send feedback");

      setProposals((prev) =>
        prev.map((p) =>
          String(p._id) === String(proposalId) ? data.proposal : p
        )
      );
      setFeedbackDraft((d) => ({ ...d, [proposalId]: "" }));
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to send feedback");
    } finally {
      setActing((p) => ({ ...p, [proposalId]: false }));
    }
  };

  const formatSemLabel = (s) =>
    `${s.season?.charAt(0).toUpperCase()}${s.season?.slice(1)} ${
      s.year
    } â€” starts ${s.startDate}`;

  return (
    <section className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" /> Supervisor
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            Proposals Submitted <span className="text-brand-600">to You</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!supervisorId ? (
          <div className="p-6 rounded-2xl border border-brand-100 bg-brand-50 text-brand-700 text-center">
            Couldn’t resolve your supervisor account.
          </div>
        ) : loading ? (
          <div className="p-4 rounded-2xl border border-brand-100 shadow-sm bg-white">
            <LoadingSpinner message="Loading proposals..." />
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-brand-200 bg-brand-50 text-brand-700 text-center font-medium">
            {error}
          </div>
        ) : proposals.length === 0 ? (
          <div className="p-8 rounded-2xl border border-brand-100 shadow-sm text-slate-600 text-center">
            No proposals submitted yet.
          </div>
        ) : (
          <ul className="space-y-6">
            {proposals.map((p) => {
              const pid = String(p._id);
              const pending = p.status === "Pending";
              return (
                <li
                  key={pid}
                  className="rounded-3xl border border-brand-100 p-6 sm:p-8 bg-white shadow-sm hover:shadow-lg transition-shadow animate-fade-up"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 w-full">
                      <h3 className="text-lg font-bold font-display text-slate-900">
                        {p.title}
                      </h3>
                      <div className="text-xs text-slate-500">
                        {p.groupName || "Unknown Group"} —{" "}
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : ""}
                      </div>
                      <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                        {p.abstract}
                      </p>

                      <div className="mt-4">
                        <textarea
                          value={feedbackDraft[pid] || ""}
                          onChange={(e) =>
                            setFeedbackDraft((f) => ({
                              ...f,
                              [pid]: e.target.value,
                            }))
                          }
                          placeholder="Write feedback..."
                          className="w-full mt-2 px-4 py-3 border border-brand-100 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                        />
                        <button
                          onClick={() => sendFeedback(pid)}
                          disabled={acting[pid]}
                          className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md transition disabled:opacity-60"
                        >
                          <Send className="w-4 h-4" /> Send Feedback
                        </button>
                      </div>

                      {Array.isArray(p.feedback) && p.feedback.length > 0 && (
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                          {p.feedback.map((f, idx) => (
                            <li
                              key={idx}
                              className="border-l-2 pl-3 border-brand-600 bg-brand-50/50 rounded-r-xl py-1.5"
                            >
                              {f.text}{" "}
                              <span className="text-xs text-slate-400">
                                ({new Date(f.date).toLocaleString()})
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${
                            p.status === "Approved"
                              ? "bg-brand-600 text-white"
                              : p.status === "Rejected"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-brand-100 text-brand-600"
                          }`}
                        >
                          {p.status}
                        </span>
                        {p.driveLink && (
                          <a
                            href={p.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 font-semibold hover:underline"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            Drive Link
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex sm:flex-col gap-2">
                      <button
                        onClick={() => openApproveModal(pid)}
                        disabled={!pending || acting[pid]}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${
                          !pending || acting[pid]
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-white text-brand-600 border border-brand-600 hover:bg-brand-50"
                        }`}
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>

                      <button
                        onClick={() => decide(pid, "reject")}
                        disabled={!pending || acting[pid]}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${
                          !pending || acting[pid]
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-brand-600 text-white hover:bg-brand-700 shadow-md"
                        }`}
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {showApproveModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <div className="bg-white border border-brand-100 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-brand-600" />
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Choose Starting Semester
                </h3>
              </div>

              <p className="text-sm text-slate-600 mb-3">
                Only upcoming semesters are shown. Current/past semesters are
                hidden.
              </p>

              <select
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
                className="w-full px-4 py-3 border border-brand-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="">Select semester</option>
                {upcomingSemesters.map((s) => (
                  <option key={s._id} value={s._id}>
                    {formatSemLabel(s)}
                  </option>
                ))}
              </select>

              {upcomingSemesters.length === 0 && (
                <div className="mt-2 text-sm text-brand-600">
                  No upcoming semesters available.
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeApproveModal}
                  className="flex-1 px-4 py-2.5 border border-brand-100 rounded-xl text-slate-700 font-semibold hover:bg-brand-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!selectedSemesterId) {
                      alert("Please choose a semester.");
                      return;
                    }
                    const pid = approveForProposalId;
                    closeApproveModal();
                    await decide(pid, "approve", selectedSemesterId);
                  }}
                  disabled={!selectedSemesterId}
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );};

export default ViewRecievedProposals;
