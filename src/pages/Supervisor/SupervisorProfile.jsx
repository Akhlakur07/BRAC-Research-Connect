import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const SupervisorProfile = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useContext(AuthContext);
  const userdata = useLoaderData();
  const User = userdata.find((u) => u.email === user?.email);
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    researchArea: "",
    photoUrl: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", phone: "" };

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10-15 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Fetch supervisor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!User?._id) throw new Error("User not found");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/supervisor/${User._id}`
        );
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Supervisor not found"
              : "Failed to load profile"
          );
        }

        const data = await res.json();
        setSupervisor(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          department: data.department || "",
          phone: data.phone || "",
          researchArea: data.researchArea || "",
          photoUrl: data.photoUrl || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (User?._id) fetchProfile();
  }, [User?._id]);

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUpdating(true);
    try {
      if (!User?._id) throw new Error("User not found");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/supervisor/update/${User._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setSupervisor(data);
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  if (!supervisor) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-slate-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-brand-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* LEFT: Update Profile */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-brand-100 animate-fade-up p-6 sm:p-8">
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-6">
            Update <span className="text-brand-600">Profile</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {["name", "email", "department", "phone", "photoUrl"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-xl ${
                      errors[field]
                        ? "border-brand-700"
                        : "border-brand-100"
                    }`}
                    disabled={field === "email"}
                  />
                  {errors[field] && (
                    <p className="mt-1 text-sm text-brand-700">
                      {errors[field]}
                    </p>
                  )}
                </div>
              )
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Research Area
              </label>
              <textarea
                name="researchArea"
                value={formData.researchArea}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-xl border-brand-100"
                disabled={updating}
              />
            </div>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* RIGHT: Profile Overview */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-brand-100 animate-fade-up p-6 sm:p-8 flex flex-col justify-start">
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-6">
            Profile <span className="text-brand-600">Overview</span>
          </h2>

          <div className="flex items-center gap-4 mb-4">
            {supervisor.photoUrl ? (
              <img
                src={supervisor.photoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-brand-600"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-slate-600">
                  {supervisor.name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {supervisor.name}
              </h3>
              <p className="text-sm text-slate-600">
                {supervisor.email}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-600">
                Department
              </dt>
              <dd className="font-medium text-slate-900">
                {supervisor.department}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-600">
                Phone
              </dt>
              <dd className="font-medium text-slate-900">
                {supervisor.phone || "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-slate-600">
                Research Area
              </dt>
              <dd className="font-medium text-slate-900">
                {supervisor.researchArea || "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
  );
};

export default SupervisorProfile;
