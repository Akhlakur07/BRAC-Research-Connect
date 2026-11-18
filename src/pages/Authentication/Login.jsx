import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { signIn } = useContext(AuthContext); // <-- useContext (not use)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(
        signIn(formData.email, formData.password),
        {
          pending: "Signing you in…",
          success: "Login successful! 🎉",
          error: {
            render({ data }) {
              // data is the error from signIn
              return data?.message || "Login failed! Please check your credentials.";
            },
          },
        }
      );
      navigate("/");
    } catch {
      // error already shown by toast.promise
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-brand-100 bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500";
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4 sm:px-6 py-12">
      <div className="max-w-md w-full bg-white border border-brand-100 rounded-3xl shadow-xl shadow-brand-100/60 p-6 sm:p-10 animate-fade-up">
        <h2 className="font-display text-3xl font-extrabold mb-2 text-slate-900 text-center">
          Welcome back
        </h2>
        <p className="text-center text-sm text-slate-500 mb-8">
          Log in to continue to BRAC Research Connect
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={inputCls}
            />
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
              placeholder="Enter your password"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 transition text-white font-semibold py-3 rounded-xl shadow-md shadow-brand-200 hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;