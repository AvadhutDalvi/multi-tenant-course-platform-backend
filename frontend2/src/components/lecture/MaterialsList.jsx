function AttachmentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M13 7.5 8.6 11.9a2.5 2.5 0 1 0 3.5 3.5l5.3-5.3a4 4 0 0 0-5.7-5.6L6 10.1a5.5 5.5 0 1 0 7.8 7.8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M4.5 6h11M8 3.5h4M7.5 8.5v5M12.5 8.5v5M6.5 6l.5 8a1.5 1.5 0 0 0 1.5 1.4h3a1.5 1.5 0 0 0 1.5-1.4l.5-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MaterialsList({
  materials,
  onAddMaterial,
  onRemoveMaterial,
  onMaterialFieldChange,
  onMaterialFileChange,
}) {
  return (
    <div className="rounded-[26px] bg-[#FBFBFF] px-5 py-5 ring-1 ring-[#F0F2F7] sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[#111827]">
            Materials
          </h3>
          <p className="mt-1 text-sm text-[#8F99AF]">
            Add downloadable resources or external links for this lecture.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddMaterial}
          className="inline-flex items-center gap-2 rounded-full border border-[#DDD8FF] bg-white px-4 py-2.5 text-sm font-semibold text-[#5B48F2] transition hover:border-[#6E59F7] hover:shadow-[0_10px_20px_rgba(91,72,242,0.12)]"
        >
          <PlusIcon />
          Add Material
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {materials.map((material, index) => (
          <div
            key={material.id}
            className="rounded-[24px] bg-white px-5 py-5 shadow-[0_10px_26px_rgba(17,24,39,0.04)] ring-1 ring-[#F2F3F7]"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-[15px] font-semibold text-[#111827]">
                Material {index + 1}
              </p>

              <button
                type="button"
                onClick={() => onRemoveMaterial(material.id)}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#E0647A] transition hover:bg-[#FFF2F5]"
              >
                <TrashIcon />
                Remove
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <label className="block">
                <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B8]">
                  Material Title
                </span>
                <input
                  type="text"
                  value={material.title}
                  onChange={(event) => onMaterialFieldChange(material.id, "title", event.target.value)}
                  placeholder="Enter material title"
                  className="h-[52px] w-full rounded-[18px] border border-[#ECEEFA] bg-[#F9FAFF] px-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#B3BDD1] focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF]"
                />
              </label>

              <div>
                <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B8]">
                  Attachment
                </span>
                <label
                  htmlFor={`material-file-${material.id}`}
                  className="flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#DADDF0] bg-[#F9FAFF] px-4 text-sm font-semibold text-[#5B48F2] transition hover:border-[#6E59F7] hover:bg-[#F5F2FF]"
                >
                  <input
                    id={`material-file-${material.id}`}
                    type="file"
                    onChange={(event) => onMaterialFileChange(material.id, event)}
                    className="hidden"
                  />
                  <AttachmentIcon />
                  {material.file ? "Replace file" : "Upload file"}
                </label>
                {material.file ? (
                  <p className="mt-2 truncate text-sm text-[#8F99AF]">{material.file.name}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-3 flex items-center gap-4">
                <span className="h-px flex-1 bg-[#E8EBF5]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A3ACC1]">
                  Or URL
                </span>
                <span className="h-px flex-1 bg-[#E8EBF5]" />
              </div>

              <input
                type="url"
                value={material.url}
                onChange={(event) => onMaterialFieldChange(material.id, "url", event.target.value)}
                placeholder="Paste resource URL"
                className="h-[52px] w-full rounded-[18px] border border-[#ECEEFA] bg-[#F9FAFF] px-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#B3BDD1] focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialsList;
