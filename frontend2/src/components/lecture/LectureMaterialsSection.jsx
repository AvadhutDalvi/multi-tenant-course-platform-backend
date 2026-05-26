
function LectureMaterialsSection({ formData, setFormData }) {

  const materials = formData.materials || [];

  function handleFileUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const newMaterial = {
      title: file.name,
      type: "PDF",
      file: file,
      tone: "bg-rose-50 text-rose-600"
    };

    setFormData((current) => ({
      ...current,
      materials: [...(current.materials || []), newMaterial]
    }));
  }

  function handleAddLink() {
    const url = prompt("Enter material link");

    if (!url) return;

    const newMaterial = {
      title: url,
      type: "Link",
      url: url,
      tone: "bg-indigo-50 text-indigo-600"
    };

    setFormData((current) => ({
      ...current,
      materials: [...(current.materials || []), newMaterial]
    }));
  }

  function handleRemove(index) {
    const updated = [...materials];
    updated.splice(index, 1);

    setFormData((current) => ({
      ...current,
      materials: updated
    }));
  }

  return (
    <section id="materials" className="scroll-mt-28 rounded-[30px] border border-white/80 bg-white px-6 py-7 shadow-[0_16px_42px_rgba(15,23,42,0.05)] sm:px-7">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
            Section 03
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Learning Materials
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
           <label className="cursor-pointer rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-500">
            Upload File

            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
         <button
            type="button"
            onClick={handleAddLink}
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Add Link
          </button>
        </div>
      </div>

     <div className="space-y-3">
        {materials.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-400">
            No materials added yet
          </div>
        )}

        {materials.map((item, index) => (
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
                  Added to lecture resources
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

export default LectureMaterialsSection;
