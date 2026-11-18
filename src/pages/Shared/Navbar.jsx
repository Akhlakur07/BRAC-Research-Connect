/* eslint-disable no-unused-vars */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { NavLink, useLoaderData, useLocation } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Bell, ChevronDown, Menu, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const linkBase =
  "block px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-brand-600 hover:bg-brand-50/70 whitespace-nowrap";
const linkActive = "text-brand-600 bg-brand-50 font-semibold shadow-xs";

const RESEARCH_ITEMS = [
  { to: "/supervisors", label: "Supervisors" },
  { to: "/synopsis", label: "Synopsis" },
];

const STUDENT_HUB_ITEMS = [
  { to: "/thesis-proposal", label: "Proposal Submission" },
  { to: "/view-announcement", label: "Announcements" },
];

const DesktopDropdown = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  const isChildActive = items.some((item) => pathname === item.to);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <li className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`${linkBase} flex items-center gap-1 cursor-pointer ${
          isChildActive ? linkActive : ""
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 mt-2 w-52 bg-white/95 backdrop-blur-xl border border-brand-100 rounded-xl shadow-lg shadow-brand-950/10 p-1.5 z-50"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand-600 bg-brand-50 font-semibold"
                    : "text-slate-700 hover:text-brand-600 hover:bg-brand-50/70"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </li>
  );
};

const MobileDropdown = ({ label, items, onNavigate }) => {
  const { pathname } = useLocation();
  const isChildActive = items.some((item) => pathname === item.to);
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`${linkBase} w-full flex items-center justify-between cursor-pointer ${
          isChildActive ? linkActive : ""
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="mt-1 ml-3 pl-3 border-l border-brand-100 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const data = useLoaderData();

  const UserFromLoader = useMemo(
    () =>
      Array.isArray(data) ? data.find((u) => u.email === user?.email) : null,
    [data, user?.email]
  );

  const [userDoc, setUserDoc] = useState(UserFromLoader || null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [markingSeen, setMarkingSeen] = useState(false);

  useEffect(() => {
    setUserDoc(UserFromLoader || null);
  }, [UserFromLoader]);

  const fetchLatestUserDoc = useCallback(async () => {
    if (!UserFromLoader?._id) return;
    try {
      let fresh = null;
      const r = await fetch(`${API_BASE}/users/${UserFromLoader._id}`);
      if (r.ok) {
        fresh = await r.json();
      } else {
        const all = await fetch(`${API_BASE}/users/`);
        if (all.ok) {
          const arr = await all.json();
          fresh = Array.isArray(arr)
            ? arr.find((u) => u._id === UserFromLoader._id) || null
            : null;
        }
      }
      if (fresh) setUserDoc(fresh);
    } catch (err) {
      // silent
    }
  }, [UserFromLoader?._id]);

  useEffect(() => {
    if (!UserFromLoader?._id) return;
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      await fetchLatestUserDoc();
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [UserFromLoader?._id, fetchLatestUserDoc]);

  const toggleNotifications = async () => {
    const next = !showNotifications;
    setShowNotifications(next);

    if (next) await fetchLatestUserDoc();

    if (
      next &&
      userDoc &&
      userDoc._id &&
      userDoc.isSeen === false &&
      !markingSeen
    ) {
      try {
        setMarkingSeen(true);
        await fetch(`${API_BASE}/users/${userDoc._id}/notifications/seen`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        setUserDoc((prev) => (prev ? { ...prev, isSeen: true } : prev));
        // eslint-disable-next-line no-empty
      } catch (err) {
      } finally {
        setMarkingSeen(false);
      }
    }
  };

  const roleUser = UserFromLoader;
  const notifUser = userDoc || UserFromLoader;

  const LinkItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
      onClick={() => setMobileOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="bg-white/55 backdrop-blur-xl supports-[backdrop-filter]:bg-white/45 border-b border-brand-100/50 shadow-sm shadow-brand-950/5 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left - Logo */}
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-900 flex items-center gap-1.5 shrink-0 cursor-pointer"
          aria-label="Go to home"
        >
          <span>BRACU Research</span>
          <span className="text-brand-600">Connect</span>
        </button>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1 text-slate-700">
          <LinkItem to="/">Home</LinkItem>
          <DesktopDropdown label="Research" items={RESEARCH_ITEMS} />
          <LinkItem to="/thesis-process">Thesis Process</LinkItem>

          {roleUser?.role === "student" && (
            <DesktopDropdown label="Student Hub" items={STUDENT_HUB_ITEMS} />
          )}

          {roleUser?.role === "supervisor" && (
            <LinkItem to="/view-announcement">Announcements</LinkItem>
          )}

          {roleUser?.role === "admin" && (
            <LinkItem to="/admin-dashboard">Dashboard</LinkItem>
          )}
          {roleUser?.role === "admin" && (
            <LinkItem to="/semester">Semester</LinkItem>
          )}
          {roleUser?.role === "supervisor" && (
            <LinkItem to="/supervisor-dashboard">Dashboard</LinkItem>
          )}

          <LinkItem to="/all-thesis">All Thesis</LinkItem>

          {roleUser?.role === "student" && (
            <LinkItem to="/student-dashboard">Dashboard</LinkItem>
          )}
        </ul>

        {/* Right - Notifications & Auth */}
        <div className="hidden lg:flex items-center gap-3 relative shrink-0">
          {(roleUser?.role === "student" ||
            roleUser?.role === "supervisor") && (
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
                aria-haspopup="menu"
                aria-expanded={showNotifications}
              >
                <Bell size={20} />
                {notifUser?.isSeen === false && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white"
                  />
                )}
                <span className="sr-only">Open notifications</span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-h-80 overflow-y-auto bg-white border border-brand-100 rounded-xl shadow-lg z-50 divide-y divide-gray-100">
                  {Array.isArray(notifUser?.notifications) &&
                  notifUser.notifications.length > 0 ? (
                    [...notifUser.notifications].reverse().map((n, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-brand-50/60 transition"
                        onClick={() => {
                          if (n.link) window.location.href = n.link;
                          setShowNotifications(false);
                        }}
                      >
                        <p className="font-medium text-slate-800">{n.message}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(n.date).toLocaleString()}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-slate-500">
                      No notifications
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {user ? (
            <NavLink to="/login">
              <button
                onClick={logOut}
                disabled={loading}
                className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg shadow-xs hover:bg-brand-700 transition disabled:opacity-60 cursor-pointer"
              >
                Logout
              </button>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <button className="px-5 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg shadow-xs hover:bg-brand-700 transition cursor-pointer">
                Login
              </button>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={`lg:hidden border-t border-brand-100/50 bg-white/80 backdrop-blur-xl ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-4 sm:px-6 py-4 space-y-1.5 text-slate-800 font-medium">
          <LinkItem to="/">Home</LinkItem>
          <MobileDropdown
            label="Research"
            items={RESEARCH_ITEMS}
            onNavigate={() => setMobileOpen(false)}
          />
          <LinkItem to="/thesis-process">Thesis Process</LinkItem>

          {roleUser?.role === "student" && (
            <MobileDropdown
              label="Student Hub"
              items={STUDENT_HUB_ITEMS}
              onNavigate={() => setMobileOpen(false)}
            />
          )}

          {roleUser?.role === "supervisor" && (
            <LinkItem to="/view-announcement">Announcements</LinkItem>
          )}

          {roleUser?.role === "admin" && (
            <LinkItem to="/admin-dashboard">Dashboard</LinkItem>
          )}
          {roleUser?.role === "admin" && (
            <LinkItem to="/semester">Semester</LinkItem>
          )}
          {roleUser?.role === "supervisor" && (
            <LinkItem to="/supervisor-dashboard">Dashboard</LinkItem>
          )}

          <LinkItem to="/all-thesis">All Thesis</LinkItem>

          {roleUser?.role === "student" && (
            <LinkItem to="/student-dashboard">Dashboard</LinkItem>
          )}

          {/* Notifications on mobile */}
          {(roleUser?.role === "student" ||
            roleUser?.role === "supervisor") && (
            <div className="pt-2">
              <button
                onClick={toggleNotifications}
                className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm hover:bg-brand-50 hover:text-brand-600 transition"
              >
                <Bell size={18} />
                <span>Notifications</span>
                {notifUser?.isSeen === false && (
                  <span className="ml-auto w-2 h-2 bg-brand-600 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="mt-2 rounded-lg border border-brand-100 overflow-hidden divide-y divide-gray-100">
                  {Array.isArray(notifUser?.notifications) &&
                  notifUser.notifications.length > 0 ? (
                    [...notifUser.notifications].reverse().map((n, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-brand-50/60"
                        onClick={() => {
                          if (n.link) window.location.href = n.link;
                          setShowNotifications(false);
                          setMobileOpen(false);
                        }}
                      >
                        <p className="font-medium text-slate-800">{n.message}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(n.date).toLocaleString()}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-slate-500">
                      No notifications
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Auth buttons on mobile */}
          <div className="pt-3">
            {user ? (
              <button
                onClick={() => {
                  logOut();
                  setMobileOpen(false);
                }}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition disabled:opacity-60"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login" onClick={() => setMobileOpen(false)}>
                <span className="block w-full text-center px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition">
                  Login
                </span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
