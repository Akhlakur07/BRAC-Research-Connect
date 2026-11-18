import React from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Users,
  FileText,
  Landmark,
  ClipboardList,
  Gavel,
} from "lucide-react";

const Row = ({ label, value }) => (
  <tr className="border-b border-brand-100 last:border-b-0">
    <td className="py-3.5 px-4 font-semibold text-slate-900 w-1/3">{label}</td>
    <td className="py-3.5 px-4 text-slate-700">{value}</td>
  </tr>
);

const ThesisProcess = () => {
  return (
    <main className="bg-white text-slate-900 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-brand-50/70 to-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100/80 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Official Guidelines
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900">
            BRACU CSE Thesis <span className="text-brand-600">Process & Guidelines</span>
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            Everything you need to know about eligibility, Pre-Thesis I & II, marking rubrics, plagiarism limits, penalties, and internship rules.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 lg:grid-cols-[1fr_280px]">
        {/* Content */}
        <article className="space-y-12">
          {/* Quick TOC (mobile) */}
          <nav className="lg:hidden rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3">
              On this page
            </p>
            <ul className="grid grid-cols-2 gap-2 text-sm font-medium">
              <li><a href="#start" className="text-brand-600 hover:underline">Requirements to Start</a></li>
              <li><a href="#policies" className="text-brand-600 hover:underline">General Policies</a></li>
              <li><a href="#marking" className="text-brand-600 hover:underline">Marking Criteria</a></li>
              <li><a href="#reports" className="text-brand-600 hover:underline">Reports</a></li>
              <li><a href="#penalties" className="text-brand-600 hover:underline">Penalties</a></li>
              <li><a href="#notes" className="text-brand-600 hover:underline">Internship Notes</a></li>
            </ul>
          </nav>

          {/* Requirements */}
          <section id="start" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Requirements to Start Thesis / Project / Internship
              </h2>
            </div>
            <p className="text-slate-600 mb-5 text-sm sm:text-base leading-relaxed">
              Each member must individually satisfy the criteria below and register for Pre-Thesis 1 via the department’s Google Form. Effective for groups registering from Fall 2022.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-xs">
              <table className="w-full text-sm md:text-base">
                <tbody className="[&>tr>td]:align-top">
                  <Row label="Minimum Credits" value="75" />
                  <Row
                    label="CGPA & Eligibility"
                    value={
                      <ul className="list-disc pl-5 space-y-1">
                        <li>CGPA &lt; 2.0 → Not eligible</li>
                        <li>CGPA ≥ 2.0 → Eligible for Project/Internship</li>
                        <li>CGPA ≥ 3.0 → Eligible for Thesis/Project/Internship</li>
                      </ul>
                    }
                  />
                  <Row label="Group Size" value="Min 1, Max 5 (Internship: Max 1)" />
                  <Row
                    label="Supervisor Count"
                    value="Up to 2 supervisors and 2 co-supervisors per group"
                  />
                </tbody>
              </table>
            </div>
          </section>

          {/* General Policies */}
          <section id="policies" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                General Policies
              </h2>
            </div>
            <ol className="space-y-3 text-slate-700 list-decimal pl-5 text-sm sm:text-base leading-relaxed bg-white rounded-2xl border border-brand-100 p-6 shadow-xs">
              <li>At most two supervisors and two co-supervisors are allowed per group.</li>
              <li>Students in the final thesis/project/internship phase may take a maximum of 3 additional courses with CSE400. Exceptional cases may petition.</li>
              <li>Pre-Thesis I and Pre-Thesis II must be completed before appearing at the thesis defense.</li>
              <li>Supervisors must submit the list of groups they approve for final defense two weeks before the report submission deadline.</li>
              <li>If a group fails to convince examiners in any of the three phases (Pre-Thesis I, Pre-Thesis II, Final Defense), that phase is considered incomplete; supervisor marks alone are not sufficient to obtain a CSE400 grade.</li>
              <li>Every thesis group must submit a camera-ready IEEE-style article with the final report. Readiness for submission carries 5% marks; this 5% is only awarded to articles already submitted to a conference or journal.</li>
              <li>Each level (Pre-Thesis 1, Pre-Thesis 2, Final Thesis) spans one semester (see internship notes for timing differences).</li>
            </ol>
          </section>

          {/* Marking Criteria */}
          <section id="marking" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Marking Criteria
              </h2>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-6 text-slate-700 text-sm sm:text-base leading-relaxed">
              The detailed rubrics are maintained by the department. A group needs at least{" "}
              <strong className="text-brand-700">60%</strong> in Pre-Thesis 1 and 2 to be promoted to the next stage.{" "}
              <a
                className="text-brand-600 font-semibold underline decoration-2 underline-offset-4 hover:text-brand-700"
                href="https://docs.google.com/spreadsheets/d/1PnvmE6MaldPadO8S5bjHajgxZTfdZEz4/edit?gid=384748274#gid=384748274"
                target="_blank"
                rel="noreferrer"
              >
                View Marking Rubrics (Google Sheet)
              </a>
              .
            </div>
          </section>

          {/* Reports */}
          <section id="reports" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Reports
              </h2>
            </div>
            <ul className="space-y-2.5 text-slate-700 list-disc pl-5 text-sm sm:text-base leading-relaxed bg-white rounded-2xl border border-brand-100 p-6 shadow-xs">
              <li>
                All reports must have plagiarism ≤ <strong className="text-brand-700">15%</strong> (Turnitin). Email{" "}
                <a className="text-brand-600 font-medium hover:underline" href="mailto:librarian@bracu.ac.bd">
                  librarian@bracu.ac.bd
                </a>{" "}
                or consult your supervisor.
              </li>
              <li>
                Submit the <strong>AI report</strong> generated from Turnitin along with the plagiarism report.
              </li>
              <li>All reports must be submitted within the semester’s declared deadlines.</li>
            </ul>
          </section>

          {/* Penalties */}
          <section id="penalties" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Penalties
              </h2>
            </div>

            <p className="text-slate-600 mb-4 text-sm sm:text-base">
              The following actions incur mark deductions (affect all group members unless noted).
            </p>

            <div className="overflow-x-auto rounded-2xl border border-brand-100 shadow-xs bg-white">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-brand-50/80 text-slate-900">
                  <tr className="text-left border-b border-brand-100">
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Deduction</th>
                    <th className="py-3.5 px-4 font-bold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 text-slate-700">
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Break/Division of a group</td>
                    <td className="py-3.5 px-4">Pre-Thesis 1: −2; Pre-Thesis 2: −3; Final Defense: −5</td>
                    <td className="py-3.5 px-4">Affects all members</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Adding new members after Pre-Thesis 1 registration</td>
                    <td className="py-3.5 px-4">−2</td>
                    <td className="py-3.5 px-4">May be waived in certain cases</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Information update / deferring after deadline</td>
                    <td className="py-3.5 px-4">−1 per change</td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Thesis title/abstract update</td>
                    <td className="py-3.5 px-4">First change: 0; Afterwards: −1 per change</td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Mismatch of title/abstract (database vs submitted report)</td>
                    <td className="py-3.5 px-4">−2</td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Absent in Final Defense after NOT deferring</td>
                    <td className="py-3.5 px-4">−5</td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Absent in Pre-Thesis 1 or 2 after NOT deferring</td>
                    <td className="py-3.5 px-4">−2</td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Internship notes */}
          <section id="notes" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Internship Notes
              </h2>
            </div>
            <ul className="space-y-2.5 text-slate-700 list-disc pl-5 text-sm sm:text-base leading-relaxed bg-white rounded-2xl border border-brand-100 p-6 shadow-xs">
              <li>Internship group size: maximum 1 student.</li>
              <li>Apply to the CSE Chairperson. Use an approved company list; special cases may propose another company with a detailed profile for approval.</li>
              <li>An internal faculty member will be assigned as internship supervisor/co-supervisor.</li>
              <li>
                Timing: Each level (Pre-1, Pre-2, Final Thesis) is one semester. Overall duration is ~1 year. Within six months after the internship ends, submit Pre-2. In the Final Thesis semester, develop a project based on what you learned and defend it on time (email for queries:{" "}
                <a className="text-brand-600 font-medium hover:underline" href="mailto:rabiul.alam@bracu.ac.bd">
                  rabiul.alam@bracu.ac.bd
                </a>
                ).
              </li>
            </ul>
          </section>

          {/* Back / top */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 transition text-sm font-semibold"
            >
              ← Back to Home
            </Link>
            <a
              href="#start"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition text-sm font-semibold shadow-xs"
            >
              Back to Top
            </a>
          </div>
        </article>

        {/* Sticky Sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 h-max">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-4">
              On this page
            </p>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#start" className="text-slate-700 hover:text-brand-600 transition">Requirements to Start</a></li>
              <li><a href="#policies" className="text-slate-700 hover:text-brand-600 transition">General Policies</a></li>
              <li><a href="#marking" className="text-slate-700 hover:text-brand-600 transition">Marking Criteria</a></li>
              <li><a href="#reports" className="text-slate-700 hover:text-brand-600 transition">Reports</a></li>
              <li><a href="#penalties" className="text-slate-700 hover:text-brand-600 transition">Penalties</a></li>
              <li><a href="#notes" className="text-slate-700 hover:text-brand-600 transition">Internship Notes</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ThesisProcess;
