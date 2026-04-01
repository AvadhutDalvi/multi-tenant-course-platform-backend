import { useAuth } from "../../auth/hooks/useAuth.js";
import GlobalSearchBar from "./GlobalSearchBar.jsx";

function DashboardTopbar() {
  const { user } = useAuth();

  return (
    <header className="border-b border-white/70 bg-[#f7f7fa]/90 px-5 py-4 backdrop-blur md:px-8 xl:px-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      
        <GlobalSearchBar/>

        <div className="flex items-center justify-between gap-4 xl:justify-end">
          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 md:flex">
            <a href="#courses" className="transition hover:text-slate-900">
              Courses
            </a>
            <a href="#mentors" className="transition hover:text-slate-900">
              Mentors
            </a>
            <a href="#pricing" className="transition hover:text-slate-900">
              Pricing
            </a>
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.23 1.38-.66 1.94L5 14h14l-1.34-1.86a3.3 3.3 0 0 1-.66-1.94V8a5 5 0 0 0-5-5Z"
                fill="currentColor"
              />
              <path d="M9.5 18a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Alex Rivers</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
                {user?.role === "educator" ? "Creator" : "Lumina Plus"}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-cyan-300 text-sm font-semibold text-white">
              AR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardTopbar;
