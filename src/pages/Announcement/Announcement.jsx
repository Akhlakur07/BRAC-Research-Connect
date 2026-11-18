import React, { useState, useEffect, useContext } from "react";
import { Plus, Eye, Edit2, Trash2, X } from "lucide-react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useLoaderData } from "react-router";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Announcement = () => {
  const { user } = useContext(AuthContext); // Assuming user.role exists
  const data = useLoaderData();
  const User = data.find((User) => User.email === user?.email);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchAnnouncements();
        closeModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/announcements/${selectedAnnouncement._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        fetchAnnouncements();
        closeModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      const res = await fetch(`${API_BASE}/announcements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (edit = false, announcement = null) => {
    setIsEditing(edit);
    if (edit && announcement) {
      setSelectedAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        description: announcement.description,
      });
    } else {
      setFormData({ title: "", description: "" });
      setSelectedAnnouncement(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
    setFormData({ title: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 animate-fade-up">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Announcements
          </h1>
          {User?.role === "admin" && (
            <button
              onClick={() => openModal(false)}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl shadow-md shadow-brand-200 hover:bg-brand-700 transition"
            >
              <Plus size={18} /> New Announcement
            </button>
          )}
        </div>

        {/* Announcements List */}
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="p-6 border border-brand-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition"
              >
                <h2 className="font-display text-lg font-bold text-slate-900 mb-1">
                  {a.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {a.description}
                </p>
                {user?.role === "admin" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openModal(true, a)}
                      className="p-2 rounded-lg text-brand-600 bg-brand-50 hover:bg-brand-100 transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="p-2 rounded-lg text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-slate-500">No announcements yet</p>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-brand-100 rounded-3xl shadow-2xl w-full max-w-lg animate-fade-up">
            <div className="flex justify-between items-center p-5 border-b border-brand-100">
              <h2 className="font-display text-xl font-bold text-slate-900">
                {isEditing ? "Edit Announcement" : "New Announcement"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition">
                <X />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                rows={4}
              />
            </div>
            <div className="flex justify-end p-5 border-t border-brand-100 gap-2">
              <button onClick={closeModal} className="px-5 py-2.5 border border-brand-100 rounded-xl text-slate-700 font-semibold hover:bg-brand-50 transition">
                Cancel
              </button>
              <button
                onClick={isEditing ? handleEdit : handleCreate}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
