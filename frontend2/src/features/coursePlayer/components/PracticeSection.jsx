function getFileType(url = "") {
  const ext = url.split(".").pop().toLowerCase();

  if (["pdf"].includes(ext)) return "PDF";
  if (["zip", "rar"].includes(ext)) return "ZIP";
  if (["doc", "docx"].includes(ext)) return "DOC";
  if (["xlsx", "xls"].includes(ext)) return "XLS";
  if (["ppt", "pptx"].includes(ext)) return "PPT";

  return "FILE";
}

function PracticeSection({ practiceSheet }) {

  if (!practiceSheet) {
    return (
      <p className="text-sm text-slate-400">
        No practice sheet available.
      </p>
    );
  }

  const fileType = getFileType(practiceSheet.url);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h2 className="text-lg font-semibold text-slate-800">
        Practice Sheet
      </h2>

      {/* CARD */}
      <a
        href={practiceSheet.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
      >

        {/* FILE TYPE */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-600">
          {fileType}
        </div>

        {/* INFO */}
        <div className="flex-1">

          <p className="truncate text-sm font-medium text-slate-800">
            {practiceSheet.title || "Practice Sheet"}
          </p>

          <p className="text-xs text-slate-400">
            Download and solve before the next lecture.
          </p>

        </div>

      </a>

    </div>
  );
}

export default PracticeSection;