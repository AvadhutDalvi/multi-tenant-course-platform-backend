function Toggle({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative h-7 w-12 rounded-full transition ${
        enabled ? "bg-indigo-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Metric({ value, label }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4">
      <p className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

function RightSidebarPanels({ formData, setFormData }) {
  function togglePreview() {
    setFormData((current) => ({
      ...current,
      isPreview: !current.isPreview
    }));
  }

  function togglePublished() {
    setFormData((current) => ({
      ...current,
      status:
        current.status === "published"
          ? "draft"
          : "published"
    }));
  }

  function handleDateChange(event) {
    setFormData((current) => ({
      ...current,
      releaseDate: event.target.value
    }));
  }

  return (
    <div className="space-y-5 xl:sticky xl:top-28">

      {/* Visibility */}
      <section className="rounded-[28px] border border-white/80 bg-white px-5 py-6 shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
          Visibility
        </h2>

        <div className="mt-6 space-y-5">

          {/* Free Preview */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">
                Free Preview
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Allow students to sample this lecture.
              </p>
            </div>

            <Toggle
              enabled={formData.isPreview}
              onClick={togglePreview}
            />
          </div>

          {/* Published */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">
                Published
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Visible in course curriculum.
              </p>
            </div>

            <Toggle
              enabled={formData.status === "published"}
              onClick={togglePublished}
            />
          </div>

          {/* Release Date */}
          <label className="block">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Schedule Release
            </span>

            <input
              type="date"
              value={formData.releaseDate || ""}
              onChange={handleDateChange}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>
      </section>

      {/* Performance */}
      <section className="rounded-[28px] border border-white/80 bg-white px-5 py-6 shadow-[0_16px_42px_rgba(15,23,42,0.05)]">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
          Performance
        </h2>

        <div className="mt-5 grid gap-3">
          <Metric value="1,245" label="Students" />
          <Metric value="72%" label="Completion" />
          <Metric value="4.8" label="Rating" />
        </div>
      </section>

      {/* Insights */}
      <section className="rounded-[28px] border border-indigo-100 bg-indigo-50/70 px-5 py-6 shadow-[0_16px_42px_rgba(79,70,229,0.08)]">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
          Creator Insights
        </h2>

        <div className="mt-5 space-y-3">
          {[
            "Practice sheets increase engagement by 24%",
            "Students who download materials complete more lessons",
            "Add one quiz to boost retention"
          ].map((insight) => (
            <div
              key={insight}
              className="flex gap-3 rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold leading-6 text-slate-600"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default RightSidebarPanels;