import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLoaderData, Link } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Users, FileText, Tag } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SupervisorGroups = () => {
  const { user } = useContext(AuthContext);
  const users = useLoaderData(); // loader returns /users
  const supervisorUser = useMemo(
    () => users?.find((u) => u.email === user?.email),
    [users, user?.email]
  );

  const [loading, setLoading] = useState(true);
  const [groupsById, setGroupsById] = useState({}); // { [groupId]: groupDoc }
  const [acceptedProposals, setAcceptedProposals] = useState([]); // accepted for this supervisor
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccepted = async () => {
      if (!supervisorUser?._id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");

      try {
        // 1) proposals submitted to this supervisor
        const res = await fetch(
          `${API_BASE}/proposals?supervisorId=${supervisorUser._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch proposals");

        const all = await res.json();

        // 2) only accepted
        const accepted = (all || []).filter(
          (p) => p?.status === "Approved" || p?.supervisorapproved === true
        );
        setAcceptedProposals(accepted);

        // 3) unique groupIds from accepted proposals
        const ids = Array.from(
          new Set(
            accepted
              .map((p) => p.groupId)
              .filter(Boolean)
              .map((id) => String(id))
          )
        );

        // 4) fetch each group's details
        const fetchedGroups = {};
        await Promise.all(
          ids.map(async (gid) => {
            try {
              const gRes = await fetch(`${API_BASE}/groups/${gid}`);
              if (gRes.ok) {
                const g = await gRes.json();
                fetchedGroups[gid] = g;
              }
            } catch (e) {
              console.error("Group fetch failed:", gid, e);
            }
          })
        );

        setGroupsById(fetchedGroups);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load accepted proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchAccepted();
  }, [supervisorUser?._id]);

  // proposals grouped by groupId
  const proposalsByGroup = useMemo(() => {
    const map = {};
    for (const p of acceptedProposals) {
      const gid = String(p.groupId);
      if (!map[gid]) map[gid] = [];
      map[gid].push(p);
    }
    return map;
  }, [acceptedProposals]);

  // stable order: by group name
  const orderedGroupIds = useMemo(() => {
    return Object.keys(proposalsByGroup).sort((a, b) => {
      const ga = groupsById[a]?.name?.toLowerCase() ?? "";
      const gb = groupsById[b]?.name?.toLowerCase() ?? "";
      return ga.localeCompare(gb);
    });
  }, [proposalsByGroup, groupsById]);

  return (
    <section className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" /> Supervision
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            Groups You’ve <span className="text-brand-600">Accepted</span>
          </h1>
          <p className="text-slate-600 mt-3">
            One row per group with its accepted proposal(s).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="rounded-2xl border border-brand-100 p-8 bg-white shadow-sm text-center">
            <p className="text-slate-600">Loading…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-brand-200 p-8 bg-brand-50 text-center">
            <p className="text-brand-700 font-medium">{error}</p>
          </div>
        ) : orderedGroupIds.length === 0 ? (
          <div className="rounded-2xl border border-brand-100 p-8 bg-white shadow-sm text-center">
            <p className="text-slate-600">
              You haven’t accepted any proposals yet.
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {orderedGroupIds.map((gid) => {
              const group = groupsById[gid];
              const groupProps = proposalsByGroup[gid] || [];

              return (
                <li
                  key={gid}
                  className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow animate-fade-up"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold font-display text-slate-900">
                        {group?.name || "Unnamed Group"}
                      </h3>
                      <div className="mt-1 text-sm text-slate-600">
                        Assigned Supervisor:{" "}
                        <span className="font-semibold text-brand-600">You</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600">
                        <Users className="w-4 h-4" />
                        {Array.isArray(group?.members)
                          ? group.members.length
                          : 0}
                        /{group?.maxMembers ?? 5}
                      </span>
                    </div>
                  </div>

                  {Array.isArray(group?.researchInterests) &&
                    group.researchInterests.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.researchInterests.map((tag) => (
                          <span
                            key={`${gid}-${tag}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-600"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                  <div className="my-5 h-px bg-brand-100" />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-brand-600" />
                      <span className="text-sm font-semibold text-slate-800">
                        Accepted Proposal{groupProps.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {groupProps.map((p) => (
                        <li
                          key={p._id}
                          className="p-4 rounded-2xl border border-brand-100 bg-brand-50/50"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <div className="font-semibold text-slate-900">
                                {p.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                {p.createdAt
                                  ? new Date(p.createdAt).toLocaleDateString()
                                  : ""}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-semibold">
                                Approved
                              </span>
                              {p.driveLink && (
                                <a
                                  href={p.driveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-600 font-semibold hover:underline"
                                >
                                  Drive Link
                                </a>
                              )}
                            </div>
                          </div>

                          {p.abstract && (
                            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                              {p.abstract}
                            </p>
                          )}

                          {Array.isArray(p.domain) && p.domain.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {p.domain.map((d) => (
                                <span
                                  key={`${p._id}-${d}`}
                                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-brand-100 text-slate-700"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );};

export default SupervisorGroups;
