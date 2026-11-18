import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const normalizeId = (rawId) => {
  // handle different shapes of _id that may come from your API
  if (!rawId) return null;
  if (typeof rawId === "string") return rawId;
  if (rawId.$oid) return rawId.$oid;
  if (rawId.toString) return rawId.toString();
  return String(rawId);
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({ name: "", photoUrl: "" });
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      // normalize id into `id` field for easier handling
      const normalized = data.map((u) => ({
        ...u,
        id: normalizeId(u._id),
      }));
      setUsers(normalized);
    } catch (err) {
      console.error("fetchUsers:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const email = localStorage.getItem("userEmail");
    if (email) setCurrentUserEmail(email);
  }, []);

  const handleDeleteUser = async (id, role, email) => {
    if (role === "admin") {
      alert("Admins cannot be deleted from this page.");
      return;
    }
    if (email === currentUserEmail) {
      alert("You cannot delete yourself.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchUsers();
    } catch (err) {
      console.error("handleDeleteUser:", err);
      alert("Failed to delete user. Check console for details.");
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditData({ name: user.name || "", photoUrl: user.photoUrl || "" });
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditData({ name: "", photoUrl: "" });
  };

  const handleSaveEdit = async (id) => {
    // basic validation
    if (typeof editData.name !== "string" || editData.name.trim() === "") {
      alert("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        name: editData.name.trim(),
        photoUrl: editData.photoUrl ? editData.photoUrl.trim() : "",
      };

      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Update failed");
      }

      // success
      setEditUserId(null);
      await fetchUsers();
    } catch (err) {
      console.error("handleSaveEdit:", err);
      alert("Failed to update user. Check console/network for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <h1 className="font-display text-3xl font-bold text-[#7b1e3c] mb-6">Manage Users</h1>

        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-brand-50">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Photo Url</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => u.role !== "admin")
                .map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="py-2 px-4">
                      {editUserId === u.id ? (
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="border rounded p-1 w-56"
                        />
                      ) : (
                        u.name || "-"
                      )}
                    </td>

                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4 capitalize">{u.role}</td>
                    <td className="py-2 px-4 max-w-xs truncate">
                      {editUserId === u.id ? (
                        <input
                          value={editData.photoUrl}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              photoUrl: e.target.value,
                            })
                          }
                          className="border rounded p-1 w-64"
                          placeholder="https://..."
                        />
                      ) : (
                        u.photoUrl || "-"
                      )}
                    </td>

                    <td className="py-2 px-4 space-x-2">
                      {editUserId === u.id ? (
                        <>
                          <button
                            disabled={loading}
                            onClick={() => handleSaveEdit(u.id)}
                            className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-brand-700"
                          >
                            {loading ? "Saving..." : "Save"}
                          </button>
                          <button
                            disabled={loading}
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-brand-300 text-white rounded hover:bg-brand-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(u)}
                            className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(u.id, u.role, u.email)
                            }
                            className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-700"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

              {users.filter((u) => u.role !== "admin").length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageUsers;
