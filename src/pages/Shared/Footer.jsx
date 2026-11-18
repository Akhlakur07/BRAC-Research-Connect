import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-white text-slate-700 border-t border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="max-w-xs">
            <h2 className="text-2xl font-extrabold font-display tracking-tight text-slate-900">
              BRACU Research <span className="text-brand-600">Connect</span>
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              A unified thesis management portal for BRAC University students and supervisors to collaborate, explore topics, and succeed.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Navigation</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link to="/" className="hover:text-brand-600 transition">Home</Link>
                </li>
                <li>
                  <Link to="/supervisors" className="hover:text-brand-600 transition">Supervisors</Link>
                </li>
                <li>
                  <Link to="/synopsis" className="hover:text-brand-600 transition">Synopsis</Link>
                </li>
                <li>
                  <Link to="/thesis-process" className="hover:text-brand-600 transition">Thesis Process</Link>
                </li>
                <li>
                  <Link to="/all-thesis" className="hover:text-brand-600 transition">All Thesis</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Resources</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link to="/all-faqs" className="hover:text-brand-600 transition">FAQs</Link>
                </li>
                <li>
                  <Link to="/search-feature" className="hover:text-brand-600 transition">Quick Search</Link>
                </li>
                <li>
                  <a
                    href="https://cse.bracu.ac.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-600 transition"
                  >
                    BRACU CSE
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Portal</h3>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link to="/login" className="hover:text-brand-600 transition">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-brand-600 transition">Register</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BRACU Research Connect. All rights reserved.</p>
          <div className="flex items-center gap-5 font-medium">
            <a href="https://www.bracu.ac.bd" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition">
              BRAC University
            </a>
            <a href="https://cse.bracu.ac.bd" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition">
              CSE Department
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
