function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M8 12.5 12 8.5l4 4M12 9v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 15a3.5 3.5 0 0 0-.66-6.94 5 5 0 0 0-9.71-1.26A4 4 0 0 0 5.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PracticeSheet({ practiceSheet, onFieldChange, onFileChange }) {
  return (
    <div className="rounded-[26px] bg-[#FBFBFF] px-5 py-5 ring-1 ring-[#F0F2F7] sm:px-6">
      <div>
        <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[#111827]">
          Practice Sheet
        </h3>
        <p className="mt-1 text-sm text-[#8F99AF]">
          Attach a worksheet or external practice resource.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B8]">
            Sheet Title
          </span>
          <input
            type="text"
            value={practiceSheet.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Enter sheet title"
            className="h-[52px] w-full rounded-[18px] border border-[#ECEEFA] bg-[#F9FAFF] px-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#B3BDD1] focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF]"
          />
        </label>

        <div>
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B8]">
            Upload Sheet
          </span>
          <label
            htmlFor="practice-sheet-file"
            className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#D9DDF1] bg-[#F8F9FF] px-6 py-7 text-center transition hover:border-[#705CF7] hover:bg-[#F5F2FF]"
          >
            <input
              id="practice-sheet-file"
              type="file"
              onChange={onFileChange}
              className="hidden"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#6347F5] shadow-[0_12px_30px_rgba(17,24,39,0.08)] transition group-hover:scale-105">
              <UploadIcon />
            </div>
            <p className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-[#111827]">
              {practiceSheet.file ? practiceSheet.file.name : "Click or drag to upload"}
            </p>
            <p className="mt-2 text-sm text-[#98A2B8]">
              PDF, DOCX, or worksheet file
            </p>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-[#E8EBF5]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A3ACC1]">
            Or URL
          </span>
          <span className="h-px flex-1 bg-[#E8EBF5]" />
        </div>

        <label className="block">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B8]">
            Sheet URL
          </span>
          <input
            type="url"
            value={practiceSheet.url}
            onChange={(event) => onFieldChange("url", event.target.value)}
            placeholder="Paste practice sheet URL"
            className="h-[52px] w-full rounded-[18px] border border-[#ECEEFA] bg-[#F9FAFF] px-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#B3BDD1] focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF]"
          />
        </label>
      </div>
    </div>
  );
}

export default PracticeSheet;
