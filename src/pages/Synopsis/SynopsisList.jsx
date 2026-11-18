import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import {
  Search,
  ExternalLink,
  BookOpen,
  Mail,
  RefreshCw,
  X,
  FileText,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "?";

const SmallAvatar = ({ photoUrl, name, size = "w-10 h-10" }) => {
  const [failed, setFailed] = useState(false);

  if (photoUrl && !failed) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setFailed(true)}
        className={`${size} rounded-full object-cover border border-gray-200 shrink-0 bg-slate-100`}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full bg-[#7b1e3c]/10 border border-[#7b1e3c]/30 flex items-center justify-center shrink-0`}
    >
      <span className="text-xs font-bold text-[#7b1e3c]">
        {getInitials(name)}
      </span>
    </div>
  );
};

const SynopsisList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSupervisorParam = searchParams.get("supervisor") || "";

  const [synopses, setSynopses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(initialSupervisorParam);

  // Detail modal state
  const [activeSynopsis, setActiveSynopsis] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const fetchSynopses = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      const url = forceRefresh
        ? `${API_BASE}/synopses?refresh=true`
        : `${API_BASE}/synopses`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch BRACU CSE synopses");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setSynopses(list);

      if (initialSupervisorParam) {
        setSearch(initialSupervisorParam);
      }
    } catch (err) {
      console.error(err);
      const msg = err.message || "Could not load synopses";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSynopses(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const param = searchParams.get("supervisor") || "";
    if (param) {
      setSearch(param);
    }
  }, [searchParams]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (activeSynopsis) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [activeSynopsis]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return synopses.filter((item) => {
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.supervisorName?.toLowerCase().includes(q) ||
        item.supervisorEmail?.toLowerCase().includes(q)
      );
    });
  }, [synopses, search]);

  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = search.trim() !== "";

  const clearFilters = () => {
    setSearch("");
    if (searchParams.has("supervisor")) {
      setSearchParams({});
    }
  };

  const openDetails = async (item) => {
    setActiveSynopsis(item);
    setDetailData(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/synopsis/detail?url=${encodeURIComponent(item.url)}`
      );
      if (!res.ok) throw new Error("Failed to load synopsis details");
      const data = await res.json();
      setDetailData(data);
    } catch (err) {
      console.error(err);
      setDetailError(err.message || "Could not load synopsis details");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setActiveSynopsis(null);
    setDetailData(null);
    setDetailError("");
    setDetailLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <span className="loading loading-spinner loading-lg text-[#7b1e3c]" />
        <p className="text-gray-600 mt-4 text-lg">
          Loading BRACU CSE thesis synopses...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              BRACU CSE Thesis <span className="text-[#7b1e3c]">Synopsis</span>
            </h1>
          </div>

          <button
            onClick={() => fetchSynopses(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-100 bg-white text-slate-700 hover:bg-brand-50/50 transition text-sm font-medium self-start md:self-auto disabled:opacity-60 shadow-xs"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Synopses"}
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-brand-100 p-4 sm:p-5 shadow-sm mb-8 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by synopsis title, supervisor name, or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-100 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-brand-100/60 text-xs text-slate-500">
            <span>
              Showing <strong>{filtered.length}</strong> of{" "}
              <strong>{synopses.length}</strong> synopses
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-brand-600 font-semibold hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Error / Empty / Grid */}
        {error && !synopses.length ? (
          <div className="bg-white border border-rose-200 rounded-xl p-8 text-center">
            <p className="text-rose-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchSynopses(true)}
              className="px-5 py-2.5 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : !filtered.length ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-600 text-lg">
              No synopses found matching your search or supervisor filter.
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((item) => (
                <div
                  key={item.id || item.url}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#7b1e3c]/10 text-[#7b1e3c] flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Supervisor Info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 mb-5">
                      <SmallAvatar
                        photoUrl={item.photoUrl}
                        name={item.supervisorName}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.supervisorName || "BRACU CSE Faculty"}
                        </p>
                        {item.supervisorEmail && (
                          <a
                            href={`mailto:${item.supervisorEmail}`}
                            className="text-xs text-slate-600 hover:text-[#7b1e3c] flex items-center gap-1 truncate"
                          >
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{item.supervisorEmail}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openDetails(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#7b1e3c] text-white hover:bg-[#651730] transition text-xs font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Details
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-100 transition text-xs font-semibold"
                    >
                      BRACU CSE Link
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-slate-700 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                      p === currentPage
                        ? "bg-brand-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-slate-700 hover:bg-brand-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-slate-700 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Synopsis Detail Modal */}
      {activeSynopsis && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4 bg-slate-50">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {detailData?.title || activeSynopsis.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <SmallAvatar
                    photoUrl={detailData?.photoUrl || activeSynopsis.photoUrl}
                    name={
                      detailData?.supervisorName ||
                      activeSynopsis.supervisorName
                    }
                    size="w-9 h-9"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-800">
                      {detailData?.supervisorName ||
                        activeSynopsis.supervisorName}
                      {detailData?.designation
                        ? ` · ${detailData.designation}`
                        : ""}
                    </p>
                    {(detailData?.supervisorEmail ||
                      activeSynopsis.supervisorEmail) && (
                      <p className="text-xs text-slate-600">
                        {detailData?.supervisorEmail ||
                          activeSynopsis.supervisorEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200/60 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {detailLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <span className="loading loading-spinner loading-md text-[#7b1e3c]" />
                  <p className="text-sm text-gray-500 mt-3">
                    Fetching full synopsis details from BRACU CSE...
                  </p>
                </div>
              ) : detailError ? (
                <div className="py-8 text-center">
                  <p className="text-rose-600 text-sm mb-4">{detailError}</p>
                  <a
                    href={activeSynopsis.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7b1e3c] text-white rounded-lg text-sm font-medium"
                  >
                    Open on BRACU CSE
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : detailData?.contentHtml ? (
                <div
                  className="text-sm text-slate-700 leading-relaxed space-y-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:text-[#7b1e3c] [&_a]:underline [&_hr]:my-4 [&_hr]:border-gray-200 [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: detailData.contentHtml }}
                />
              ) : (
                <p className="text-sm text-gray-600">
                  No additional detail sections were found on the BRACU CSE
                  page. Use the link below to view the original page.
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              {detailData?.profileUrl ? (
                <a
                  href={detailData.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#7b1e3c] hover:underline inline-flex items-center gap-1"
                >
                  Supervisor BRACU Profile
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <a
                  href={activeSynopsis.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7b1e3c] text-white hover:bg-[#651730] transition text-xs font-semibold"
                >
                  View on BRACU CSE
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-slate-700 hover:bg-gray-100 transition text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SynopsisList;
