import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useLoaderData } from "react-router";

const ThesisProposalForm = () => {
  const { user } = useContext(AuthContext);
  const data = useLoaderData();
  const User = data.find((u) => u.email === user?.email);

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    domain: "",
    supervisor: "",
    driveLink: "",
  });

  const [supervisors, setSupervisors] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch group of which user is admin
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/groups/by-admin/${User?._id}`
        );
        if (res.status === 404) {
          setErrorMsg("Only group creators can submit proposals.");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch group");
        const data = await res.json();
        setGroup(data);

        // ðŸš« If already has supervisor, block
        if (data?.assignedSupervisor) {
          setErrorMsg(
            "Your group already has a supervisor assigned. You cannot submit more proposals."
          );
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Could not load group data");
      }
    };

    if (User?._id) {
      fetchGroup();
    }
  }, [User]);

  // Fetch supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/supervisors`
        );
        if (!res.ok) throw new Error("Failed to fetch supervisors");
        const data = await res.json();
        setSupervisors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!group?._id) {
      alert("You must be a group creator to submit a proposal.");
      return;
    }
    if (group?.assignedSupervisor) {
      alert(
        "Your group already has an assigned supervisor. No more proposals allowed."
      );
      return;
    }

    if (
      !formData.title ||
      !formData.abstract ||
      !formData.supervisor ||
      !formData.driveLink
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/proposals`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            domain: group?.researchInterests || [],
            studentId: User?._id,
            groupId: group._id,
            adminapproved: false,
            supervisorapproved: false,
            groupName: group.name,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit proposal");

      alert("Thesis Proposal Submitted Successfully!");
      setFormData({
        title: "",
        abstract: "",
        domain: "",
        supervisor: "",
        driveLink: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting proposal");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-brand-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-600";
  const readCls =
    "w-full px-4 py-3 rounded-xl border border-brand-100 bg-brand-50 text-slate-600 cursor-not-allowed";
  const labelCls = "block mb-1.5 text-sm font-semibold text-slate-800";

  return (
    <section className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            Submit Thesis <span className="text-brand-600">Proposal</span>
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="w-full bg-white border border-brand-100 rounded-3xl shadow-lg p-6 sm:p-10 animate-fade-up">
          {group && (
            <div>
              <label className={labelCls}>Group Name</label>
              <input
                type="text"
                name="domain"
                value={group?.name}
                readOnly
                className={readCls}
              />
            </div>
          )}

          {errorMsg ? (
            <p className="text-center text-brand-700 bg-brand-50 border border-brand-100 rounded-2xl p-4 mt-6 font-medium">
              {errorMsg}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div>
                <label className={labelCls}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Abstract</label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  rows={5}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={group?.researchInterests?.join(", ") || ""}
                  readOnly
                  className={readCls}
                />
              </div>

              <div>
                <label className={labelCls}>Supervisor</label>
                {loading ? (
                  <p className="text-slate-600">Loading supervisors...</p>
                ) : (
                  <select
                    name="supervisor"
                    value={formData.supervisor}
                    onChange={handleChange}
                    className={inputCls}
                    required
                  >
                    <option value="">Select supervisor</option>
                    {supervisors.map((sup) => (
                      <option key={sup._id} value={sup._id}>
                        {sup.name || sup.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className={labelCls}>Google Drive Link</label>
                <input
                  type="url"
                  name="driveLink"
                  value={formData.driveLink}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                Submit Proposal
              </button>
            </form>
          )}
        </div>
        </div>
      </div>
    </section>
  );};

export default ThesisProposalForm;
