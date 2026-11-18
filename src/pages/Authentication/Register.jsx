import React, { use, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useNavigate } from "react-router";

const Register = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    creditsCompleted: "",
    photoUrl: "",
    password: "",
  });
  const { createUser } = use(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setFormData({
      name: "",
      email: "",
      studentId: "",
      creditsCompleted: "",
      photoUrl: "",
      password: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create user in Firebase Authentication
    createUser(formData.email, formData.password)
      .then(() => {
        alert("Registration successful!");

        // Conditional API POST request based on role
        const endpoint = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/users`;

        // Prepare data to post
        const postData =
          role === "student"
            ? { ...formData, role: "student" }
            : {
                name: formData.name,
                email: formData.email,
                photoUrl: formData.photoUrl,
                password: formData.password,
                role: "supervisor",
              };

        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => response.json())
          .then(() => {
            navigate("/login");
          })
          .catch((error) => {
            console.error("Error posting data:", error);
            alert("There was an issue with the registration data submission.");
          });
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        alert("Registration failed! Please try again.");
      });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4 sm:px-6 py-12">
      <div className="max-w-md w-full bg-white border border-brand-100 rounded-3xl shadow-xl shadow-brand-100/60 p-6 sm:p-10 animate-fade-up">
        <h2 className="font-display text-3xl font-extrabold mb-6 text-slate-900 text-center">
          Register as {role === "student" ? "Student" : "Supervisor"}
        </h2>

        <div className="mb-6 flex justify-center gap-3">
          <label className="px-4 py-2 rounded-full border border-brand-100 bg-brand-50 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={handleRoleChange}
              className="mr-2 accent-brand-600"
            />
            Student
          </label>
          <label className="px-4 py-2 rounded-full border border-brand-100 bg-brand-50 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="supervisor"
              checked={role === "supervisor"}
              onChange={handleRoleChange}
              className="mr-2 accent-brand-600"
            />
            Supervisor
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold text-slate-700">
              {role === "student" ? "G-Suite Email" : "BRAC Email"}
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                role === "student"
                  ? "example@gsuite.bracu.ac.bd"
                  : "example@bracu.ac.bd"
              }
              className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {role === "student" && (
            <>
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                  Student ID
                </label>
                <input
                  required
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., 1801234"
                  className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                  Total Credits Completed
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  max={200}
                  name="creditsCompleted"
                  value={formData.creditsCompleted}
                  onChange={handleChange}
                  placeholder="e.g., 75"
                  className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1.5 text-sm font-semibold text-slate-700">
              Photo URL
            </label>
            <input
              required
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="Paste a URL to your photo"
              className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
            {formData.photoUrl && (
              <img
                src={formData.photoUrl}
                alt="Photo preview"
                className="mt-3 w-28 h-28 rounded-full object-cover border-2 border-brand-100"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              className="w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 transition text-white font-semibold py-3 rounded-xl shadow-md shadow-brand-200 hover:shadow-lg"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
