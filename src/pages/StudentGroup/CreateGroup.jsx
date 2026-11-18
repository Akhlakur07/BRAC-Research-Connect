import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CreateGroup = () => {
  const { user } = useContext(AuthContext); // Firebase user (login gate only)
  const { id: routeUserId } = useParams(); // Mongo user _id from URL: /create-group/:id

  const [dbUser, setDbUser] = useState(null); // Mongo user doc
  const [loadingUser, setLoadingUser] = useState(true);

  // Admin-created group (if any)
  const [myAdminGroup, setMyAdminGroup] = useState(null);
  const [checkingAdminGroup, setCheckingAdminGroup] = useState(true);

  // Any membership gate: if student is in ANY group (as admin or member)
  const [memberGroup, setMemberGroup] = useState(null);
  const [checkingMembership, setCheckingMembership] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // 1) Load Mongo user by :id
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoadingUser(true);
      try {
        if (!routeUserId) {
          setDbUser(null);
          return;
        }
        const res = await fetch(`${API_BASE}/users/${routeUserId}`);
        if (!res.ok) {
          setDbUser(null);
          return;
        }
        const data = await res.json();
        if (!ignore) setDbUser(data);
      } catch (e) {
        console.error("Load user error:", e);
        if (!ignore) setDbUser(null);
      } finally {
        if (!ignore) setLoadingUser(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [routeUserId]);

  // 2) Check if this user already created a group (admin)
  useEffect(() => {
    let ignore = false;
    const checkAdminGroup = async () => {
      if (!dbUser?._id) {
        setMyAdminGroup(null);
        setCheckingAdminGroup(false);
        return;
      }
      setCheckingAdminGroup(true);
      try {
        const res = await fetch(`${API_BASE}/groups/by-admin/${dbUser._id}`);
        if (res.status === 404) {
          if (!ignore) setMyAdminGroup(null);
        } else if (res.ok) {
          const g = await res.json();
          if (!ignore) setMyAdminGroup(g);
        } else {
          if (!ignore) setMyAdminGroup(null);
        }
      } catch (e) {
        console.error("Check admin group error:", e);
        if (!ignore) setMyAdminGroup(null);
      } finally {
        if (!ignore) setCheckingAdminGroup(false);
      }
    };
    checkAdminGroup();
    return () => {
      ignore = true;
    };
  }, [dbUser?._id]);

  // 3) Check if user is already a MEMBER of ANY group (includes admin as well, but we also check separately)
  useEffect(() => {
    let ignore = false;
    const checkMembership = async () => {
      if (!dbUser?._id) {
        setMemberGroup(null);
        setCheckingMembership(false);
        return;
      }
      setCheckingMembership(true);
      try {
        const res = await fetch(`${API_BASE}/groups`);
        const all = res.ok ? await res.json() : [];
        const myIdStr = String(dbUser._id);
        // find any group where this user is in members or is admin
        const found = (Array.isArray(all) ? all : []).find(
          (g) =>
            String(g.admin) === myIdStr ||
            (Array.isArray(g.members) &&
              g.members.some((m) => String(m) === myIdStr))
        );
        if (!ignore) setMemberGroup(found || null);
      } catch (e) {
        console.error("Check membership error:", e);
        if (!ignore) setMemberGroup(null);
      } finally {
        if (!ignore) setCheckingMembership(false);
      }
    };
    checkMembership();
    return () => {
      ignore = true;
    };
  }, [dbUser?._id]);

  const alreadyBlocked = useMemo(() => {
    // Block if: user already admin of a group OR member of any group
    return Boolean(myAdminGroup || memberGroup);
  }, [myAdminGroup, memberGroup]);

  const canSubmit = useMemo(() => {
    return Boolean(
      name.trim() &&
        interests.length > 0 &&
        dbUser?._id &&
        dbUser?.role === "student" &&
        !alreadyBlocked
    );
  }, [name, interests, dbUser, alreadyBlocked]);

  // Form helpers
  const addInterest = () => {
    const raw = interestInput.trim();
    if (!raw) return;
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const merged = Array.from(new Set([...interests, ...parts]));
    setInterests(merged);
    setInterestInput("");
  };

  const removeInterest = (tag) => {
    setInterests((prev) => prev.filter((i) => i !== tag));
  };

  const onKeyDownInterest = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addInterest();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          adminId: String(dbUser._id),
          researchInterests: interests,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create group");
      }
      setName("");
      setInterests([]);
      alert("Group created successfully!");
      // Once created, set gates so the form won't re-appear
      setMyAdminGroup(data.group);
      setMemberGroup(data.group);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create group");
    } finally {
      setSubmitting(false);
    }
  };

  // Render
  return (
    <section className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-brand-50 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            Create <span className="text-brand-600">Group</span>
          </h1>
          <p className="text-slate-600 mt-3">
            Start a research group. You’ll be the{" "}
            <span className="font-semibold text-brand-600">group admin</span>. Max
            members: 5.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mt-6 rounded-2xl border border-brand-100 bg-white shadow-sm p-5">
        {loadingUser ? (
          <div className="text-slate-600">
            Checking your accountâ€¦
          </div>
        ) : !routeUserId ? (
          <div className="text-brand-700">
            No user id found in the URL. Make sure your route is like{" "}
            <code>/create-group/:id</code>.
          </div>
        ) : !user ? (
          <div className="text-brand-700">
            Please log in to create a group.
          </div>
        ) : !dbUser ? (
          <div className="text-brand-700">
            Couldnâ€™t find your BRACU account in the database. Contact admin.
          </div>
        ) : dbUser.role !== "student" ? (
          <div className="text-brand-700">
            Only students can create groups.
          </div>
        ) : checkingAdminGroup || checkingMembership ? (
          <div className="text-slate-600">
            Checking your group statusâ€¦
          </div>
        ) : alreadyBlocked ? (
          <div className="rounded-xl border border-brand-100 p-5 bg-brand-50">
            <p className="text-brand-600 font-semibold">
              You already belong to a group. You canâ€™t create another group.
            </p>

            {myAdminGroup ? (
              <div className="mt-2 text-sm text-slate-600 space-y-1">
                <div>
                  <span className="font-medium">(You are the Admin) Name:</span>{" "}
                  {myAdminGroup.name}
                </div>
                <div>
                  <span className="font-medium">Members:</span>{" "}
                  {(myAdminGroup.members && myAdminGroup.members.length) || 1} /{" "}
                  {myAdminGroup.maxMembers || 5}
                </div>
                {Array.isArray(myAdminGroup.researchInterests) &&
                  myAdminGroup.researchInterests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {myAdminGroup.researchInterests.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-brand-100 text-brand-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            ) : memberGroup ? (
              <div className="mt-2 text-sm text-slate-600 space-y-1">
                <div>
                  <span className="font-medium">Group Name:</span>{" "}
                  {memberGroup.name}
                </div>
                <div>
                  <span className="font-medium">Members:</span>{" "}
                  {(memberGroup.members && memberGroup.members.length) || 0} /{" "}
                  {memberGroup.maxMembers || 5}
                </div>
                {Array.isArray(memberGroup.researchInterests) &&
                  memberGroup.researchInterests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {memberGroup.researchInterests.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-brand-100 text-brand-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            ) : null}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Group Name <span className="text-brand-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 outline-none shadow-sm focus:ring-2 focus:ring-brand-600 focus:border-brand-600 text-slate-900"
                placeholder="e.g., Vision & NLP Group"
              />
            </div>

            {/* Research Interests */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Research Interests (one or many){" "}
                <span className="text-brand-600">*</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={onKeyDownInterest}
                  className="flex-1 rounded-xl border border-brand-100 bg-white px-4 py-3 outline-none shadow-sm focus:ring-2 focus:ring-brand-600 focus:border-brand-600 text-slate-900"
                  placeholder="Add and press Enter (or comma). e.g., NLP, Computer Vision"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Chips */}
              {interests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {interests.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-brand-100 text-brand-600"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeInterest(tag)}
                        className="rounded-full w-5 h-5 inline-flex items-center justify-center bg-brand-200 hover:bg-brand-300"
                        aria-label={`Remove ${tag}`}
                        title="Remove"
                      >
                        Ã—
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition disabled:opacity-50"
              >
                {submitting ? "Creatingâ€¦" : "Create Group"}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              On create: assigned supervisor is <em>None</em>, proposals
              submitted to is <em>empty</em>.
            </p>
          </form>
        )}
      </div>
        </div>
      </div>
    </section>
  );
};

export default CreateGroup;

