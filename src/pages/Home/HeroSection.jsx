/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CalendarCheck,
  Search,
} from "lucide-react";

const stats = [
  { value: "250+", label: "Faculty Supervisors" },
  { value: "100+", label: "Thesis Synopses" },
  { value: "6", label: "Step Roadmap" },
  { value: "24/7", label: "Portal Access" },
];

const features = [
  { icon: Users, title: "Find Supervisors", text: "Browse 250+ BRACU CSE faculty and see who is accepting." },
  { icon: BookOpen, title: "Explore Synopses", text: "Discover live thesis topics offered by faculty." },
  { icon: CalendarCheck, title: "Track Progress", text: "Proposals, meetings and feedback in one place." },
  { icon: ShieldCheck, title: "Stay Compliant", text: "Clear rules, rubrics and plagiarism guidelines." },
];

const marqueeItems = [
  "Thesis Proposals", "Supervisor Matching", "Pre-Thesis I & II", "Group Formation",
  "Meeting Scheduler", "Paper Recommendations", "Final Defense", "IEEE Reports",
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-brand-200/60 blur-3xl animate-blob" />
      <div className="absolute top-20 -right-32 w-[26rem] h-[26rem] rounded-full bg-brand-100 blur-3xl animate-blob [animation-delay:-6s]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-24 pb-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-xs font-semibold shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              BRAC University · CSE Research Portal
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-display text-slate-900 leading-[1.05] tracking-tight">
              Your thesis,{" "}
              <span className="text-gradient">beautifully</span>{" "}
              organized.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Find the right supervisor, explore live thesis synopses, submit
              proposals and track every milestone — all in one modern portal
              built for BRACU students and faculty.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
              <Link
                to="/supervisors"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-600 text-white rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all font-semibold"
              >
                Find a Supervisor
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/thesis-process"
                className="inline-flex items-center justify-center px-7 py-4 border border-brand-200 bg-white text-brand-600 rounded-xl hover:bg-brand-50 hover:border-brand-300 hover:-translate-y-0.5 transition-all font-semibold"
              >
                Thesis Process
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-3 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[GraduationCap, Users, BookOpen].map((Icon, i) => (
                  <span key={i} className="w-9 h-9 rounded-full bg-brand-600 text-white ring-2 ring-white flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </span>
                ))}
              </div>
              Trusted by students & supervisors across BRACU CSE
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-600/20 to-brand-200/40 rounded-[2rem] blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-brand-100 shadow-2xl bg-white p-2">
              <img
                src="https://i.ibb.co.com/RTjKHzb5/banner.jpg"
                alt="Thesis management illustration"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>

            <div className="hidden sm:flex absolute -left-6 top-10 items-center gap-3 bg-white rounded-2xl shadow-xl border border-brand-100 px-4 py-3 animate-float-slow">
              <span className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none">250+ Supervisors</p>
                <p className="text-xs text-slate-500 mt-1">Updated live</p>
              </div>
            </div>
            <div className="hidden sm:flex absolute -right-4 bottom-10 items-center gap-3 bg-white rounded-2xl shadow-xl border border-brand-100 px-4 py-3 animate-float-slow [animation-delay:-3s]">
              <span className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none">Live Synopses</p>
                <p className="text-xs text-slate-500 mt-1">Explore topics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 rounded-3xl bg-brand-600 text-white p-6 md:p-8 shadow-xl shadow-brand-600/20">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold font-display">{s.value}</p>
              <p className="text-xs md:text-sm text-white/75 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group bg-white rounded-2xl border border-brand-100 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-300 transition-all duration-300"
            >
              <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold font-display text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative border-y border-brand-100 bg-brand-50/60 py-4 overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-10 text-sm font-semibold text-brand-600/80 uppercase tracking-widest">
              {item}
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
