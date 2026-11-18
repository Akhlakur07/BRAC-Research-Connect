import React, { useContext, useEffect, useState, useMemo } from "react";
import { useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import {
  Calendar,
  Clock,
  Users,
  Video,
  X,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ScheduleMeetings = () => {
  const { user } = useContext(AuthContext);
  const data = useLoaderData();

  // Find supervisor user
  const User = useMemo(
    () =>
      Array.isArray(data) ? data.find((u) => u.email === user?.email) : null,
    [data, user?.email]
  );

  const [assignedGroups, setAssignedGroups] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [viewingMeeting, setViewingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    groupId: "",
    meetingLink: "",
  });

  // Fetch assigned groups and meetings
  useEffect(() => {
    const fetchData = async () => {
      if (!User?._id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const supervisorId = String(User._id);

      try {
        // Fetch assigned groups
        const gres = await fetch(`${API_BASE}/groups`);
        const gjson = gres.ok ? await gres.json() : [];
        const mine = Array.isArray(gjson)
          ? gjson.filter((g) => String(g.assignedSupervisor) === supervisorId)
          : [];
        setAssignedGroups(mine);

        // Fetch meetings
        const mres = await fetch(
          `${API_BASE}/meetings?supervisorId=${supervisorId}`
        );
        const mjson = mres.ok ? await mres.json() : [];
        setMeetings(Array.isArray(mjson) ? mjson : []);
      } catch (err) {
        console.error("ScheduleMeetings fetch error:", err);
        setAssignedGroups([]);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [User?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      groupId: "",
      meetingLink: "",
    });
    setEditingMeeting(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (meeting) => {
    setFormData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      groupId: String(meeting.groupId),
      meetingLink: meeting.meetingLink || "",
    });
    setEditingMeeting(meeting);
    setShowModal(true);
  };

  const handleView = (meeting) => {
    setViewingMeeting(meeting);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.groupId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const url = editingMeeting
        ? `${API_BASE}/meetings/${editingMeeting._id}`
        : `${API_BASE}/meetings`;

      const method = editingMeeting ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          supervisorId: User._id,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (editingMeeting) {
          // Update existing meeting
          setMeetings((prev) =>
            prev.map((m) => (m._id === editingMeeting._id ? result.meeting : m))
          );
          alert("Meeting updated successfully!");
        } else {
          // Add new meeting
          setMeetings((prev) => [result.meeting, ...prev]);
          alert("Meeting scheduled successfully!");
        }

        setShowModal(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save meeting");
      }
    } catch (err) {
      console.error("Error saving meeting:", err);
      alert("Failed to save meeting");
    }
  };

  const handleDelete = async (meetingId) => {
    if (!confirm("Are you sure you want to delete this meeting?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/meetings/${meetingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supervisorId: User._id,
        }),
      });

      if (response.ok) {
        setMeetings((prev) => prev.filter((m) => m._id !== meetingId));
        alert("Meeting deleted successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete meeting");
      }
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert("Failed to delete meeting");
    }
  };

  const formatDateTime = (date, time) => {
    const meetingDate = new Date(`${date}T${time}`);
    return meetingDate.toLocaleString();
  };

  const getGroupName = (groupId) => {
    const group = assignedGroups.find((g) => String(g._id) === String(groupId));
    return group?.name || "Unknown Group";
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingMeeting(null);
  };

  // Separate meetings by status and time
  const upcomingMeetings = meetings
    .filter((meeting) => {
      const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
      return meetingDateTime >= new Date() && meeting.status === "scheduled";
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );

  const pastMeetings = meetings
    .filter((meeting) => {
      const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
      return meetingDateTime < new Date() || meeting.status !== "scheduled";
    })
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
    );

  return (
    <section className="min-h-screen bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-2">
            Schedule Meetings
          </h1>
          <p className="text-slate-600">
            Manage and schedule meetings with your assigned groups
          </p>
        </div>

        {/* Create Meeting Button */}
        <div className="mb-6">
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors flex items-center gap-2"
            disabled={assignedGroups.length === 0}
          >
            <Calendar className="w-5 h-5" />
            Create Meeting
          </button>
          {assignedGroups.length === 0 && (
            <p className="text-sm text-slate-500 mt-2">
              You need assigned groups to schedule meetings
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Groups */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-100 animate-fade-up">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              Your Assigned Groups
            </h2>

            {loading ? (
              <div className="text-slate-500">Loading groups...</div>
            ) : assignedGroups.length === 0 ? (
              <div className="text-slate-500">No groups assigned yet.</div>
            ) : (
              <div className="space-y-3">
                {assignedGroups.map((group) => (
                  <div
                    key={group._id}
                    className="p-4 rounded-2xl border border-brand-100 bg-brand-50/40 "
                  >
                    <div className="font-semibold text-slate-900">
                      {group.name}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Members: {(group.members || []).length} • Interests:{" "}
                      {(group.researchInterests || []).join(", ") || "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-100 animate-fade-up">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Upcoming Meetings
            </h2>

            {loading ? (
              <div className="text-slate-500">Loading meetings...</div>
            ) : upcomingMeetings.length === 0 ? (
              <div className="text-slate-500">No upcoming meetings.</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="p-4 rounded-2xl border border-brand-100 bg-brand-50/40 "
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-slate-900">
                        {meeting.title}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleView(meeting)}
                          className="p-1 text-brand-600 hover:bg-brand-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(meeting)}
                          className="p-1 text-brand-500 hover:bg-brand-50 rounded"
                          title="Edit Meeting"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(meeting._id)}
                          className="p-1 text-brand-700 hover:bg-brand-100 rounded"
                          title="Delete Meeting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Group: {getGroupName(meeting.groupId)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDateTime(meeting.date, meeting.time)}
                    </div>
                    {meeting.meetingLink && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline text-sm flex items-center gap-1 mt-2"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Meetings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-100 animate-fade-up">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              Past Meetings
            </h2>

            {loading ? (
              <div className="text-slate-500">Loading meetings...</div>
            ) : pastMeetings.length === 0 ? (
              <div className="text-slate-500">No past meetings.</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pastMeetings.slice(0, 10).map((meeting) => (
                  <div
                    key={meeting._id}
                    className="p-4 rounded-2xl border border-brand-100 bg-brand-50/40 "
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-slate-900">
                        {meeting.title}
                      </div>
                      <button
                        onClick={() => handleView(meeting)}
                        className="p-1 text-brand-600 hover:bg-brand-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Group: {getGroupName(meeting.groupId)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDateTime(meeting.date, meeting.time)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Status: {meeting.status || "Completed"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Meeting Modal */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Enter meeting title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Group *
                  </label>
                  <select
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    required
                  >
                    <option value="">Select a group</option>
                    {assignedGroups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="meetingLink"
                    value={formData.meetingLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-brand-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="https://meet.google.com/... or Zoom link"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-brand-100 rounded-xl text-slate-700 hover:bg-brand-50/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700"
                  >
                    {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Meeting Modal */}
        {showViewModal && viewingMeeting && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Meeting Details
                </h3>
                <button
                  onClick={closeViewModal}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <div className="text-slate-900">
                    {viewingMeeting.title}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Group
                  </label>
                  <div className="text-slate-900">
                    {getGroupName(viewingMeeting.groupId)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date & Time
                  </label>
                  <div className="text-slate-900">
                    {formatDateTime(viewingMeeting.date, viewingMeeting.time)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <div className="text-slate-900">
                    {viewingMeeting.status || "Scheduled"}
                  </div>
                </div>

                {viewingMeeting.meetingLink && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Meeting Link
                    </label>
                    <a
                      href={viewingMeeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                    </a>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeViewModal}
                    className="flex-1 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl hover:bg-slate-200"
                  >
                    Close
                  </button>
                  {/* Show edit button only for upcoming meetings */}
                  {new Date(`${viewingMeeting.date}T${viewingMeeting.time}`) >=
                    new Date() && (
                    <button
                      onClick={() => {
                        closeViewModal();
                        handleEdit(viewingMeeting);
                      }}
                      className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700"
                    >
                      Edit Meeting
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScheduleMeetings;
