function DashboardFooter() {
  return (
    <footer className="mt-4 bg-white px-5 py-10 md:px-8 xl:px-10">
      <div className="grid gap-10 border-t border-slate-100 pt-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">The Digital Atelier</h3>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
            Editorial excellence in education. Curated paths for the modern digital creative.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Platform</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <p>Browse Courses</p>
            <p>Live Mentorship</p>
            <p>Certifications</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Resources</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <p>Help Center</p>
            <p>Community Forum</p>
            <p>Design Tools</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Legal</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Cookie Settings</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Digital Atelier LMS. Editorial excellence in education.</p>
        <div className="flex gap-6">
          <span>Twitter</span>
          <span>Instagram</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}

export default DashboardFooter;
