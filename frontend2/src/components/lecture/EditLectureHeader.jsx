function EditLectureHeader({ formData, setFormData }) {
  return (
    <header className="rounded-[32px] border border-white/80 bg-white px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-400" aria-label="Breadcrumb">
        <span>Dashboard</span>
        <span className="text-slate-300">/</span>
        <span>My Courses</span>
        <span className="text-slate-300">/</span>
        <span>React Masterclass</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-indigo-600">Edit Lecture</span>
      </nav>

      <div className="mt-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
            Lecture Workspace
          </p>
          <h1 className="mt-3 max-w-3xl text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[40px]">
           Editing Lecture:{" "}
          {formData?.title || "Loading..."}
          </h1>
          <p className="mt-3 text-base font-medium text-slate-500">
            Last updated{" "}
            {formData?.updatedAt
              ? new Date(formData.updatedAt).toLocaleDateString()
              : "Recently"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Autosaved
          </span>

          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
          >
            Save Draft
          </button>

          <button
            type="button"
            className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 hover:shadow-indigo-300"
          >
            Update Lecture
          </button>
        </div>
      </div>
    </header>
  );
}

export default EditLectureHeader;
