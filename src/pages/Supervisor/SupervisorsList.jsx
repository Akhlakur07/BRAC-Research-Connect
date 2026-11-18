import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import {
  Search,
  Mail,
  ExternalLink,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const LEVEL_LABELS = {
  U: "Undergraduate (U)",
  P: "Postgraduate (P)",
  "U & P": "Both (U & P)",
};

const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "?";

const SupervisorAvatar = ({ photoUrl, name }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (photoUrl && !imgFailed) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImgFailed(true)}
        className="w-16 h-16 rounded-full object-cover border-2 border-[#7b1e3c]/80 shrink-0 bg-slate-100"
      />
    );
  }

  return (
    <div className="w-16 h-16 rounded-full bg-[#7b1e3c]/10 border-2 border-[#7b1e3c]/30 flex items-center justify-center shrink-0">
      <span className="text-lg font-bold text-[#7b1e3c]">
        {getInitials(name)}
      </span>
    </div>
  );
};

const SupervisorsList = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");

  const fetchSupervisors = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      const url = forceRefresh
        ? `${API_BASE}/bracu-supervisors?refresh=true`
        : `${API_BASE}/bracu-supervisors`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch BRACU CSE supervisors");
      const data = await res.json();
      setSupervisors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      const msg = err.message || "Could not load supervisors";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSupervisors(false);
  }, []);

  const designations = useMemo(() => {
    const set = new Set();
    supervisors.forEach((s) => {
      if (s.designation) set.add(s.designation);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [supervisors]);

  const stats = useMemo(() => {
    const total = supervisors.length;
    const accepting = supervisors.filter((s) => s.accepting).length;
    const notAccepting = total - accepting;
    return { total, accepting, notAccepting };
  }, [supervisors]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return supervisors.filter((sup) => {
      if (statusFilter === "accepting" && !sup.accepting) return false;
      if (statusFilter === "not_accepting" && sup.accepting) return false;
      if (levelFilter !== "all" && sup.levelBadge !== levelFilter) return false;
      if (
        designationFilter !== "all" &&
        sup.designation !== designationFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        sup.name?.toLowerCase().includes(q) ||
        sup.email?.toLowerCase().includes(q) ||
        sup.designation?.toLowerCase().includes(q)
      );
    });
  }, [supervisors, search, statusFilter, levelFilter, designationFilter]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    levelFilter !== "all" ||
    designationFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setLevelFilter("all");
    setDesignationFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <span className="loading loading-spinner loading-lg text-[#7b1e3c]" />
        <p className="text-gray-600 mt-4 text-lg">
          Loading BRACU CSE supervisors...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              BRACU CSE Thesis <span className="text-[#7b1e3c]">Supervisors</span>
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Live supervising directory from{" "}
              <a
                href="https://cse.bracu.ac.bd/thesis/supervising/list"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7b1e3c] font-medium hover:underline inline-flex items-center gap-1"
              >
                cse.bracu.ac.bd/thesis/supervising/list
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>
          </div>

          <button
            onClick={() => fetchSupervisors(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-slate-700 hover:bg-gray-100 transition text-sm font-medium self-start md:self-auto disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#7b1e3c]/10 text-[#7b1e3c] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Total Supervisors
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Accepting
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {stats.accepting}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Not Accepting
              </p>
              <p className="text-2xl font-bold text-rose-700">
                {stats.notAccepting}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or designation..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
              />
            </div>

            {/* Level Filter */}
            <div className="md:col-span-3">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                aria-label="Filter by supervising level"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
              >
                <option value="all">All Levels</option>
                <option value="U">Undergraduate (U)</option>
                <option value="P">Postgraduate (P)</option>
                <option value="U & P">Both (U & P)</option>
              </select>
            </div>

            {/* Designation Filter */}
            <div className="md:col-span-4">
              <select
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
                aria-label="Filter by designation"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#7b1e3c]"
              >
                <option value="all">All Designations</option>
                {designations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Pills + Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: "all", label: "All" },
                { key: "accepting", label: "Accepting" },
                { key: "not_accepting", label: "Not Accepting" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setStatusFilter(opt.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                    statusFilter === opt.key
                      ? "bg-[#7b1e3c] text-white"
                      : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span>
                Showing <strong>{filtered.length}</strong> of{" "}
                <strong>{supervisors.length}</strong> supervisors
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[#7b1e3c] font-semibold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && !supervisors.length ? (
          <div className="bg-white border border-rose-200 rounded-xl p-8 text-center">
            <p className="text-rose-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchSupervisors(true)}
              className="px-5 py-2.5 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : !filtered.length ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-600 text-lg">
              No supervisors match your current filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition text-sm font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((sup) => (
              <div
                key={sup.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        sup.accepting
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sup.accepting ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      {sup.status || (sup.accepting ? "Accepting" : "Not Accepting")}
                    </span>

                    {sup.levelBadge && (
                      <span
                        title={LEVEL_LABELS[sup.levelBadge] || sup.levelBadge}
                        className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200"
                      >
                        {sup.levelBadge}
                      </span>
                    )}
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <SupervisorAvatar photoUrl={sup.photoUrl} name={sup.name} />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                        {sup.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {sup.designation || "Faculty"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  {sup.email && (
                    <a
                      href={`mailto:${sup.email}`}
                      className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#7b1e3c] break-all mb-4"
                    >
                      <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>{sup.email}</span>
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 mt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    to={`/synopsis?supervisor=${encodeURIComponent(sup.name)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7b1e3c]/10 text-[#7b1e3c] hover:bg-[#7b1e3c] hover:text-white transition text-xs font-semibold"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    View Synopses
                  </Link>

                  {sup.profileUrl && (
                    <a
                      href={sup.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-100 transition text-xs font-semibold"
                    >
                      BRACU Profile
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorsList;
