import React from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Users,
  FileText,
  FolderOpen,
  Landmark,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: <GraduationCap className="w-5 h-5 text-brand-600" />,
    title: "Eligibility & Team Formation",
    description:
      "Complete at least 75 credits. Form a group of 1–5 members with similar research interests.",
  },
  {
    icon: <Users className="w-5 h-5 text-brand-600" />,
    title: "Supervisor & Topic Selection",
    description:
      "Find a supervisor, discuss your ideas, and finalize a topic or research area.",
  },
  {
    icon: <FileText className="w-5 h-5 text-brand-600" />,
    title: "Pre-Thesis Phases",
    description:
      "Register for Pre-Thesis 1 & 2, submit reports, create a poster, and check plagiarism.",
  },
  {
    icon: <FolderOpen className="w-5 h-5 text-brand-600" />,
    title: "Thesis Registration & Progress",
    description:
      "Register for CSE400, work on your thesis, schedule meetings, and get supervisor feedback.",
  },
  {
    icon: <Landmark className="w-5 h-5 text-brand-600" />,
    title: "Defense & Approval",
    description:
      "Present your defense, revise if needed, and get final approval from your supervisor & committee.",
  },
  {
    icon: <PackageCheck className="w-5 h-5 text-brand-600" />,
    title: "Final Submission",
    description:
      "Submit the final hard copy & IEEE report to the library, then complete clearance for graduation.",
  },
];

const ThesisWorkflow = () => {
  return (
    <section className="bg-brand-50/40 border-y border-brand-100/80 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100/80 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Step-by-Step Roadmap
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900">
            Your Thesis <span className="text-brand-600">Journey</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            From forming your group to submitting your final thesis, follow these
            clear milestones to successfully complete your BRAC University thesis.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-brand-100 p-6 shadow-xs hover:shadow-md hover:border-brand-200 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-600 text-white">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/thesis-process"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition font-semibold text-sm shadow-xs"
          >
            View Full Thesis Process
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThesisWorkflow;
