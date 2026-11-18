import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useContext(AuthContext);
  const userdata = useLoaderData();
  const User = userdata.find((u) => u.email === user?.email);
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    phone: "",
    cgpa: "",
    creditsCompleted: "",
    researchInterest: "",
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!User?._id) throw new Error("User not found");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/profile/${User._id}`
        );
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Profile not found" : "Failed to load profile"
          );
        }

        const data = await res.json();
        setStudent(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          studentId: data.studentId || "",
          department: data.department || "",
          phone: data.phone || "",
          cgpa: data.cgpa || "",
          creditsCompleted: data.creditsCompleted || "",
          researchInterest: data.researchInterest || "",
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
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/profile/update/${User._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setStudent(data);
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

  if (!student) {
    return (
      <div className="p-6 bg-white    rounded-2xl shadow-sm">
        <p className="text-slate-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-brand-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* LEFT: Update Profile */}
        <div className="flex-1 bg-white    rounded-2xl shadow-sm border border-brand-100 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-brand-700 mb-6">
            Update <span className="text-[#7b1e3c]">Profile</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              "name",
              "email",
              "studentId",
              "department",
              "phone",
              "cgpa",
              "creditsCompleted",
              "photoUrl",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field === "cgpa"
                    ? "CGPA"
                    : field === "creditsCompleted"
                    ? "Credits Completed"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field === "email"
                      ? "email"
                      : field === "cgpa" || field === "creditsCompleted"
                      ? "number"
                      : "text"
                  }
                  step={field === "cgpa" ? "0.01" : undefined}
                  min={field === "cgpa" ? "0" : undefined}
                  max={field === "cgpa" ? "4" : undefined}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-2xl ${
                    errors[field]
                      ? "border-brand-500"
                      : "border-brand-200"
                  }`}
                  disabled={field === "email"}
                />
                {errors[field] && (
                  <p className="mt-1 text-sm text-brand-600">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">
                Research Interest
              </label>
              <textarea
                name="researchInterest"
                value={formData.researchInterest}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-2xl border-brand-200"
                disabled={updating}
              />
            </div>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-[#7b1e3c] text-white rounded-2xl hover:bg-[#651730] transition disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* RIGHT: Profile Overview */}
        <div className="flex-1 bg-white    rounded-2xl shadow-sm border border-brand-100 p-6 sm:p-8 flex flex-col justify-start">
          <h2 className="font-display text-2xl font-bold text-brand-700 mb-6">
            Profile <span className="text-[#7b1e3c]">Overview</span>
          </h2>

          <div className="flex items-center gap-4 mb-4">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#7b1e3c]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-slate-600">
                  {student.name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-brand-700">
                {student.name}
              </h3>
              <p className="text-sm text-slate-600">
                {student.email}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Student ID
              </dt>
              <dd className="font-medium text-brand-700">
                {student.studentId}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Department
              </dt>
              <dd className="font-medium text-brand-700">
                {student.department}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Phone
              </dt>
              <dd className="font-medium text-brand-700">
                {student.phone || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                CGPA
              </dt>
              <dd className="font-medium text-brand-700">
                {student.cgpa}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Credits Completed
              </dt>
              <dd className="font-medium text-brand-700">
                {student.creditsCompleted}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                Research Interest
              </dt>
              <dd className="font-medium text-brand-700">
                {student.researchInterest || "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Profile;
