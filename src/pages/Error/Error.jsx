import React from "react";
import { Link } from "react-router";
import FuzzyText from "../../components/FuzzyText";

const Error = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center px-6">
      <div className="text-center animate-fade-up">
        <FuzzyText>404</FuzzyText>
        <p className="font-display mt-6 text-lg text-slate-600">
          The page you are looking for doesn't exist.
        </p>
        <Link to="/">
          <button className="mt-8 px-8 py-3 text-base font-semibold rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-200 transition">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
