

function LecturePracticeSection({formData,setFormData}) {

  const activities = formData.practice || [];

  function handleUploadSheet(event) {
    const file = event.target.files[0];

    if (!file) return;

    const newActivity = {
      title: file.name,
      type: "Sheet",
      file: file,
      tone: "bg-emerald-50 text-emerald-600"
    };

    setFormData((current) => ({
      ...current,
      practice: [...(current.practice || []), newActivity]
    }));

    event.target.value = "";
  }

  function handleRemove(index) {
    const updated = [...activities];
    updated.splice(index, 1);

    setFormData((current) => ({
      ...current,
      practice: updated
    }));
  }

  return (
    <section id="practice" className="scroll-mt-28 rounded-[30px] border border-white/80 bg-white px-6 py-7 shadow-[0_16px_42px_rgba(15,23,42,0.05)] sm:px-7">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
            Section 04
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Practice Activities
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
         <label className="cursor-pointer rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-500">
            Upload Practice Sheet

            <input
              type="file"
              className="hidden"
              onChange={handleUploadSheet}
            />
          </label>
          {/* <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Create Quiz
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Add Assignment
          </button> */}
        </div>
      </div>

       <div className="space-y-3">
        {activities.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-400">
            No practice activities added yet
          </div>
        )}

        {activities.map((item, index) => (
          <article
            key={index}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-indigo-100 hover:bg-white hover:shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${
                  item.tone || "bg-indigo-50 text-indigo-600"
                }`}
              >
                {item.type}
              </span>

              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-slate-400">
                  Included in this lecture
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
            >
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LecturePracticeSection;
