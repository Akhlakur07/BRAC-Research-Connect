import { useLoaderData } from "react-router";
import { useState } from "react";
import { X, RotateCcw } from "lucide-react";

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600";

const statusStyle = (status = "") => {
  const s = status.toLowerCase();
  if (s === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-brand-50 text-brand-600 border-brand-200";
};

const AllThesis = () => {
  const loaded = useLoaderData();
  const theses = Array.isArray(loaded) ? loaded : [];
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filterSupervisor, setFilterSupervisor] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDomain, setFilterDomain] = useState("");

  const filteredTheses = theses
    .filter((t) => (t.status || "").toLowerCase() !== "rejected")
    .filter((t) => {
      const matchesSupervisor =
        !filterSupervisor ||
        t.supervisor?.name?.toLowerCase().includes(filterSupervisor.toLowerCase());
      const matchesGroup =
        !filterGroup || t.groupName?.toLowerCase().includes(filterGroup.toLowerCase());
      const matchesStatus =
        !filterStatus || t.status?.toLowerCase() === filterStatus.toLowerCase();
      const matchesDate =
        !filterDate ||
        new Date(t.createdAt).toISOString().split("T")[0] === filterDate;
      const matchesDomain =
        !filterDomain ||
        t.domain?.some((d) => d.toLowerCase().includes(filterDomain.toLowerCase()));
      return (
        matchesSupervisor && matchesGroup && matchesStatus && matchesDate && matchesDomain
      );
    });

  const reset = () => {
    setFilterSupervisor("");
    setFilterGroup("");
    setFilterStatus("");
    setFilterDate("");
    setFilterDomain("");
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            All <span className="text-brand-600">Theses</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Browse ongoing and approved thesis work across BRACU CSE.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-brand-100 shadow-xs p-5 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600">Supervisor</label>
              <input
                value={filterSupervisor}
                onChange={(e) => setFilterSupervisor(e.target.value)}
                className={inputCls}
                placeholder="Supervisor name"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600">Group</label>
              <input
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className={inputCls}
                placeholder="Group name"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={inputCls}
              >
                <option value="">All</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600">Submitted Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600">Domain</label>
              <input
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className={inputCls}
                placeholder="Domain"
              />
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 text-sm font-semibold transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Showing <strong>{filteredTheses.length}</strong> theses
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-brand-100 shadow-xs bg-white">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-slate-900">
              <tr className="text-left">
                {["Title", "Supervisor", "Group", "Status", "Domain", "Submitted"].map((h) => (
                  <th key={h} className="py-3.5 px-4 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-slate-700">
              {filteredTheses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No theses match your filters.
                  </td>
                </tr>
              )}
              {filteredTheses.map((thesis) => (
                <tr key={thesis._id} className="hover:bg-brand-50/40 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-900 min-w-[220px]">{thesis.title}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">{thesis.supervisor?.name || "N/A"}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      className="text-brand-600 font-semibold hover:underline cursor-pointer"
                      onClick={() =>
                        setSelectedGroup({
                          name: thesis.groupName,
                          students: thesis.students || [],
                          domain: thesis.domain,
                        })
                      }
                    >
                      {thesis.groupName || "N/A"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(thesis.status)}`}>
                      {thesis.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5 min-w-[140px]">
                      {thesis.domain?.length
                        ? thesis.domain.map((d) => (
                            <button
                              key={d}
                              onClick={() => setFilterDomain(d)}
                              className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-600 border border-brand-100 hover:bg-brand-600 hover:text-white transition cursor-pointer"
                            >
                              {d}
                            </button>
                          ))
                        : "N/A"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {new Date(thesis.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedGroup && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedGroup(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="text-xl font-bold font-display text-slate-900">
                {selectedGroup.name} <span className="text-brand-600">– Members</span>
              </h3>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-500 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Domain</p>
            <div className="mb-5 flex flex-wrap gap-1.5">
              {selectedGroup.domain?.length
                ? selectedGroup.domain.map((d) => (
                    <span key={d} className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-600 border border-brand-100">
                      {d}
                    </span>
                  ))
                : "N/A"}
            </div>
            <ul className="space-y-2">
              {selectedGroup.students.map((s) => (
                <li key={s._id} className="border border-brand-100 p-3 rounded-xl">
                  <p className="font-semibold text-slate-900">{s.name || "Unnamed Student"}</p>
                  {s.email && <span className="text-xs text-slate-500">{s.email}</span>}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedGroup(null)}
              className="mt-5 w-full bg-brand-600 text-white px-4 py-2.5 rounded-lg hover:bg-brand-700 transition font-semibold text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AllThesis;
