import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLoaderData, Link } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import {
  FileText,
  ExternalLink,
  User,
  Calendar,
  Tag,
  MessageSquare,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ViewProposals = () => {
  const { user } = useContext(AuthContext);
  const data = useLoaderData();

  // Find current user in loader data
  const currentUser = useMemo(
    () =>
      Array.isArray(data) ? data.find((u) => u.email === user?.email) : null,
    [data, user?.email]
  );

  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [supervisorMap, setSupervisorMap] = useState({});
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState("");

  // Fetch the student's group
  useEffect(() => {
    const fetchGroup = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/groups/by-member/${currentUser._id}`
        );
        if (res.status === 404) {
          setGroup(null);
          setProposals([]);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch group");
        const g = await res.json();
        setGroup(g);
      } catch (e) {
        console.error(e);
        setError("Could not load your group.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [currentUser?._id]);

  // Fetch supervisors mapping (id â†’ name/email)
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await fetch(`${API_BASE}/supervisors`);
        if (!res.ok) throw new Error("Failed to fetch supervisors");
        const list = await res.json();
        const map = {};
        list.forEach((s) => {
          map[String(s._id)] = s.name || s.email || "Supervisor";
        });
        setSupervisorMap(map);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSupervisors();
  }, []);

  // Fetch all proposals for this group
  useEffect(() => {
    const fetchProposalsForGroup = async () => {
      if (!group?._id) return;
      setLoading(true);
      setError("");

      try {
        const supIds = Array.isArray(group.proposalsSubmittedTo)
          ? group.proposalsSubmittedTo
          : [];

        if (supIds.length === 0) {
          setProposals([]);
          setLoading(false);
          return;
        }

        const requests = supIds.map((sid) =>
          fetch(`${API_BASE}/proposals?supervisorId=${sid}`)
        );
        const responses = await Promise.allSettled(requests);

        let allProposals = [];
        for (const r of responses) {
          if (r.status === "fulfilled" && r.value.ok) {
            const arr = await r.value.json();
            allProposals = allProposals.concat(arr);
          }
        }

        const myGroupId = String(group._id);
        const filtered = allProposals.filter(
          (p) => String(p.groupId) === myGroupId
        );

        // Remove duplicates
        const seen = new Set();
        const deduped = [];
        filtered.forEach((p) => {
          const id = String(p._id);
          if (!seen.has(id)) {
            seen.add(id);
            deduped.push(p);
          }
        });

        deduped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setProposals(deduped);
      } catch (e) {
        console.error(e);
        setError("Failed to load proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposalsForGroup();
  }, [group?._id, group?.proposalsSubmittedTo]);

  return (
    <section className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" /> Proposals
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            Your Group’s <span className="text-brand-600">Proposals</span>
          </h1>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">
            View every proposal your group has submitted, along with status,
            feedback, and links.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="rounded-2xl border border-brand-100 p-8 bg-white shadow-sm text-center text-slate-600">
            Loading…
          </div>
        ) : !group ? (
          <div className="p-8 rounded-2xl border border-brand-100 bg-brand-50 text-slate-700 text-center">
            You’re not currently a member of any group.
          </div>
        ) : (
          <>
            <div className="mb-6 p-5 rounded-2xl border border-brand-100 bg-brand-50/60 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    Group
                  </div>
                  <div className="text-xl font-bold font-display text-slate-900">
                    {group.name}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 font-medium">
                {error}
              </div>
            )}

            {proposals.length === 0 ? (
              <div className="p-8 rounded-2xl border border-brand-100 bg-white shadow-sm text-slate-700 text-center">
                No proposals submitted yet.
              </div>
            ) : (
              <ul className="space-y-6">
                {proposals.map((p) => {
                  const supName =
                    supervisorMap[String(p.supervisor)] || "Supervisor";
                  const created = p.createdAt ? new Date(p.createdAt) : null;
                  return (
                    <li
                      key={p._id}
                      className="p-6 sm:p-8 rounded-3xl border border-brand-100 bg-white shadow-sm hover:shadow-lg transition-shadow animate-fade-up"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-brand-600 shrink-0" />
                            <h3 className="text-lg font-bold font-display text-slate-900 truncate">
                              {p.title}
                            </h3>
                          </div>

                          <p className="text-sm text-slate-700 leading-relaxed mb-4">
                            {p.abstract}
                          </p>

                          {Array.isArray(p.domain) && p.domain.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              <Tag className="w-4 h-4 text-brand-500" />
                              {p.domain.map((d, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-600"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 mb-2">
                            <span className="inline-flex items-center gap-1">
                              <User className="w-4 h-4 text-brand-500" />
                              {supName}
                            </span>
                            {created && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-brand-500" />
                                {created.toLocaleString()}
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                p.status === "Approved"
                                  ? "bg-brand-600 text-white"
                                  : p.status === "Rejected"
                                  ? "bg-slate-200 text-slate-700"
                                  : "bg-brand-100 text-brand-600"
                              }`}
                            >
                              {p.status || "Pending"}
                            </span>
                          </div>

                          {Array.isArray(p.feedback) &&
                            p.feedback.length > 0 && (
                              <div className="mt-3 p-4 rounded-2xl bg-brand-50 text-sm text-slate-700 border border-brand-100">
                                <div className="flex items-center gap-2 mb-2 font-semibold text-brand-700">
                                  <MessageSquare className="w-4 h-4 text-brand-600" />
                                  Supervisor Feedback
                                </div>
                                {p.feedback.map((f, idx) => (
                                  <div key={idx} className="mb-2">
                                    <p>{f.text}</p>
                                    {f.date && (
                                      <div className="text-xs text-slate-500 mt-1">
                                        Given on:{" "}
                                        {new Date(f.date).toLocaleString()}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2">
                          {p.driveLink && (
                            <a
                              href={p.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-brand-100 bg-white text-sm font-semibold text-brand-600 hover:bg-brand-50 transition"
                            >
                              Drive <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        <div className="mt-10">
          <Link
            to="/student-dashboard"
            className="text-brand-600 font-semibold hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );};

export default ViewProposals;
