function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.3 8.6 15.7 12l-5.4 3.4V8.6Z" fill="currentColor" />
    </svg>
  );
}

function LectureMediaSection({ formData, setFormData }) {

  function handleVideoChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    setFormData((current) => ({
      ...current,
      video: file,
      videoPreview: URL.createObjectURL(file)
    }));
  }

  function handleThumbnailChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    setFormData((current) => ({
      ...current,
      thumbnail: file,
      thumbnailPreview: URL.createObjectURL(file)
    }));
  }

  return (
    <section id="media" className="scroll-mt-28 rounded-[30px] border border-white/80 bg-white px-6 py-7 shadow-[0_16px_42px_rgba(15,23,42,0.05)] sm:px-7">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
            Section 02
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Lecture Media
          </h2>
        </div>

        <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
          Upload Ready
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
        <div>
          <div className="relative min-h-[280px] overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0f172a,#312e81_55%,#4f46e5)] shadow-lg shadow-slate-200">
            {formData.videoPreview && (
              <video
                src={formData.videoPreview}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute left-6 top-6 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              Current Video
            </div>

            <button
              type="button"
              className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-indigo-600 shadow-2xl transition hover:scale-105"
            >
              <PlayIcon />
            </button>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                {formData.title || "Lecture Video"}
              </h3>

              <p className="mt-2 text-sm font-medium text-white/75">
                MP4 · {formData.duration || "00:00"} runtime
              </p>
            </div>
          </div>

          <label className="mt-5 inline-block cursor-pointer rounded-full border border-indigo-100 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100">
            Replace Video

            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
            />
          </label>

          {/* Upload Status */}
          {formData.video && (
            <p className="mt-3 text-sm font-medium text-emerald-600">
              Selected: {formData.video.name}
            </p>
          )}
        </div>

        {/* RIGHT SIDE THUMBNAIL */}
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Thumbnail Preview
          </p>

          <div className="relative min-h-[220px] overflow-hidden rounded-[26px] border border-slate-100 bg-slate-50 shadow-sm">

            {formData.thumbnailPreview ? (
              <img
                src={formData.thumbnailPreview}
                alt="Lecture Thumbnail"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                No Thumbnail
              </div>
            )}

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-950">
                {formData.title || "Lecture Cover"}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                1280 x 720 recommended
              </p>
            </div>
          </div>

          {/* Change Thumbnail */}
          <label className="mt-5 block w-full cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600">
            Change Thumbnail

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </label>

          {formData.thumbnail && (
            <p className="mt-3 text-sm font-medium text-emerald-600">
              Selected: {formData.thumbnail.name}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}

export default LectureMediaSection;
