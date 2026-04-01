import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

const instructorLinks = [
  { label: "Dashboard", to: "/dashboard", icon: "grid" },
  { label: "My Courses", to: "/dashboard/instructor/courses", icon: "play" },
  { label: "Assignments", to: "/dashboard", icon: "clipboard", disabled: true },
  { label: "Analytics", to: "/dashboard", icon: "chart", disabled: true },
  { label: "Settings", to: "/dashboard", icon: "settings", disabled: true },
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

  if (type === "clipboard") {
    return (
      <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
        <path d="M9 4h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 7h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
        <path d="M4 17 10 11l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={`h-4 w-4 ${color}`} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5-.98-.57a7.9 7.9 0 0 0-.44-1.07l.25-1.11a1 1 0 0 0-.28-.94l-1.41-1.41a1 1 0 0 0-.94-.28l-1.11.25c-.35-.18-.71-.33-1.08-.45L13.5 4h-3l-.57.98c-.37.12-.73.27-1.08.45l-1.11-.25a1 1 0 0 0-.94.28L5.39 6.87a1 1 0 0 0-.28.94l.25 1.11c-.17.34-.32.7-.44 1.07L4 12v2l.92.57c.12.37.27.73.44 1.07l-.25 1.11a1 1 0 0 0 .28.94l1.41 1.41a1 1 0 0 0 .94.28l1.11-.25c.35.18.71.33 1.08.45L10.5 20h3l.57-.98c.37-.12.73-.27 1.08-.45l1.11.25a1 1 0 0 0 .94-.28l1.41-1.41a1 1 0 0 0 .28-.94l-.25-1.11c.17-.34.32-.7.44-1.07L20 14v-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstructorSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
          <p className="text-sm font-semibold text-slate-900">Creator</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Creator Mode
          </p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {instructorLinks.map((link) => {
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
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-100 to-indigo-50 p-5 text-slate-900 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Pro Plan
          </p>
          <p className="mt-3 max-w-[12rem] text-sm leading-6 text-slate-500">
            Unlock advanced student insights and 4K hosting.
          </p>
          <button
            type="button"
            className="mt-4 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
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

export default InstructorSidebar;
