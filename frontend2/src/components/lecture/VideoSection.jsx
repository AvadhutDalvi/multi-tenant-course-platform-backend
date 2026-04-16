function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path d="M8 12.5 12 8.5l4 4M12 9v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 15a3.5 3.5 0 0 0-.66-6.94 5 5 0 0 0-9.71-1.26A4 4 0 0 0 5.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function InputLabel({ children }) {
  return (
    <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B8]">
      {children}
    </span>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-14 w-full rounded-[20px] border border-[#ECEEFA] bg-[#F9FAFF] px-5 text-[15px] text-[#111827] outline-none transition placeholder:text-[#B3BDD1] focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF] ${className}`}
    />
  );
}

function UploadPanel({
  label,
  file,
  inputId,
  accept,
  helperText,
  onFileChange,
  compact = false,
}) {
  return (
    <div>
      <InputLabel>{label}</InputLabel>
      <label
        htmlFor={inputId}
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#D9DDF1] bg-[#F8F9FF] px-6 text-center transition hover:border-[#705CF7] hover:bg-[#F5F2FF] ${compact ? "min-h-[210px] py-7" : "min-h-[252px] py-10"}`}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#6347F5] shadow-[0_12px_30px_rgba(17,24,39,0.08)] transition group-hover:scale-105">
          <UploadIcon />
        </div>

        <p className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-[#111827]">
          {file ? file.name : "Click or drag to upload"}
        </p>
        <p className="mt-2 max-w-[240px] text-sm leading-6 text-[#98A2B8]">
          {file ? "File selected and ready for use" : helperText}
        </p>
      </label>
    </div>
  );
}

function VideoSection({
  formData,
  isDurationEditable,
  onFieldChange,
  onVideoChange,
  onThumbnailChange,
  onToggleDurationEdit,
}) {
  return (
    <section className="rounded-[30px] bg-white px-6 py-6 shadow-[0_10px_32px_rgba(17,24,39,0.04)] ring-1 ring-[#F0F2F7] sm:px-7 sm:py-7">
      <div className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#A3ACC1]">
          Media Setup
        </p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#111827]">
          Video Details
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.8fr)]">
        <div className="space-y-6">
          <UploadPanel
            label="Lecture Video"
            file={formData.video}
            inputId="lecture-video"
            accept="video/*"
            helperText="MP4, MOV, or AVI up to 2GB"
            onFileChange={onVideoChange}
          />

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#E8EBF5]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A3ACC1]">
              Or
            </span>
            <span className="h-px flex-1 bg-[#E8EBF5]" />
          </div>

          <label className="block">
            <InputLabel>Video URL</InputLabel>
            <TextInput
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={onFieldChange}
              placeholder="Paste hosted video URL"
            />
          </label>

          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <InputLabel>Duration</InputLabel>
              <button
                type="button"
                onClick={onToggleDurationEdit}
                className="text-sm font-semibold text-[#5E4DF4] transition hover:text-[#4936E9]"
              >
                {isDurationEditable ? "Use auto-calculated" : "Edit manually"}
              </button>
            </div>

            <TextInput
              type="text"
              name="duration"
              value={formData.duration}
              onChange={onFieldChange}
              placeholder="Auto-calculated"
              disabled={!isDurationEditable}
              className={!isDurationEditable ? "cursor-not-allowed border-[#EEF1F7] bg-[#F3F5FA] text-[#98A2B8]" : ""}
            />
          </div>
        </div>

        <UploadPanel
          label="Thumbnail"
          file={formData.thumbnail}
          inputId="lecture-thumbnail"
          accept="image/*"
          helperText="Upload a preview image for this lecture"
          onFileChange={onThumbnailChange}
          compact
        />
      </div>
    </section>
  );
}

export default VideoSection;
