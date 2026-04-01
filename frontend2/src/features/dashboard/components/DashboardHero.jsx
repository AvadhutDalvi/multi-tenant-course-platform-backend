import { useAuth } from "../../auth/hooks/useAuth.js";
import GlobalSearchBar from "../../courses/components/GlobalSearchBar.jsx";

function DashboardHero() {
  const { user } = useAuth();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-sky-100/40">
      <div className="grid gap-8 p-8 lg:grid-cols-[1.4fr_0.9fr] lg:p-10">
        <div className="space-y-5">
          <div className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Student workspace
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Welcome back, {user?.role === "educator" ? "creator" : "learner"}.
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 md:text-base">
              Browse channels, jump back into your enrolled courses, and keep your
              learning momentum in one clean workspace.
            </p>
          </div>
          <GlobalSearchBar />
        </div>

        <div className="grid gap-4 rounded-[1.5rem] bg-slate-950 p-6 text-white">
          <div>
            <p className="text-sm text-slate-300">Today&apos;s focus</p>
            <p className="mt-2 text-2xl font-semibold">Structured learning flow</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Feature base
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Auth, dashboard, courses, and player are now ready to live in clear modules.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Backend ready
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Existing APIs already support enrollment, search, and learning progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardHero;
