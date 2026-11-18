import React from "react";
import { Link } from "react-router";
import {
  Users,
  FileText,
  UserCheck,
  Bell,
  Calendar,
  Search,
  ClipboardList,
  Clock,
  Settings,
  MessageCircleQuestion,
} from "lucide-react";

const adminModules = [
  {
    title: "User Management",
    description: "Create, update, and delete student/supervisor accounts.",
    icon: <Users className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/manage-users",
  },
  {
    title: "Assign Supervisors",
    description: "Manually or automatically assign supervisors to students.",
    icon: <UserCheck className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/assign-supervisor",
  },
  {
    title: "Announcements",
    description: "Broadcast notifications to all users.",
    icon: <Bell className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/announcements",
  },
  {
    title: "Search & Filtering",
    description: "Search/filter across thesis topics and research papers.",
    icon: <Search className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/search",
  }, 
  {
    title: "Create or Answer FAQs and Post",
    description: "Manage frequently asked questions and publish responses.",
    icon: <MessageCircleQuestion className="w-8 h-8 text-[#7b1e3c]" />,
    link: "/manage-faqs",
  },
];

const AdminDashboard = () => {
  return (
    <section className="bg-white min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <h1 className="font-display text-4xl font-bold text-brand-700 mb-8">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 mb-12 max-w-3xl">
          Manage all aspects of the BRACU Research Connect platform — from user accounts to thesis tracking, announcements, and system settings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminModules.map((mod, idx) => (
            <Link
              key={idx}
              to={mod.link}
              className="p-6 bg-brand-50 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition transform"
            >
              <div className="mb-4">{mod.icon}</div>
              <h3 className="text-xl font-semibold text-brand-700 mb-2">
                {mod.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {mod.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
