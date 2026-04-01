import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth.js";

const studentLinks = [
  { label: "Dashboard", to: "/dashboard", icon: "grid" },
  { label: "My Courses", to: "/dashboard/student/my-courses", icon: "play" },
  { label: "Wishlist", to: "/dashboard", icon: "heart", disabled: true },
  { label: "Profile", to: "/dashboard", icon: "user", disabled: true },
  { label: "Analytics", to: "/dashboard", icon: "chart", disabled: true },
];

function Icon({ type, active }) {
  const color = active ? "text-indigo-600" : "text-slate-400";

  if (type === "grid") {
    return (
      <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
      </svg>
    );
  }

  if (type === "play") {
    return (
      <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
        <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (type === "heart") {
    return (
      <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20.5s-7-4.35-7-10.08A4.42 4.42 0 0 1 9.5 6a4.93 4.93 0 0 1 2.5.75A4.93 4.93 0 0 1 14.5 6 4.42 4.42 0 0 1 19 10.42C19 16.15 12 20.5 12 20.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="currentColor" />
        <path d="M5 19a7 7 0 0 1 14 0" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
      <path d="M4 17 10 11l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === "educator"
    ? studentLinks.slice(0, 2)
    : studentLinks;

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sticky top-0 hidden min-h-screen w-[248px] shrink-0 border-r border-white/70 bg-[#f4f5f9] px-6 py-7 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200">
          A
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-slate-900">
            The Digital
          </p>
          <p className="text-lg font-semibold tracking-tight text-slate-900">
            Atelier
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-200 text-sm font-semibold text-slate-900">
          AR
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Learner</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {user?.role === "educator" ? "Creator Mode" : "Mastery Level 4"}
          </p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {links.map((link) => {
          const active = !link.disabled && isActive(link.to);

          return (
            <Link
              key={`${link.label}-${link.to}`}
              to={link.disabled ? location.pathname : link.to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-indigo-700 shadow-sm"
                  : link.disabled
                    ? "cursor-default text-slate-400"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
            >
              <Icon type={link.icon} active={active} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 to-violet-500 p-5 text-white shadow-xl shadow-indigo-200">
          <p className="max-w-[12rem] text-sm leading-6 text-indigo-50">
            Unlock full access to premium modules and live mentor reviews.
          </p>
          <button
            type="button"
            className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700"
          >
            Upgrade to Pro
          </button>
        </div>

        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 shadow-sm">
              ?
            </span>
            <span>Help Center</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white hover:text-slate-900"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-500 shadow-sm">
              ↪
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
 