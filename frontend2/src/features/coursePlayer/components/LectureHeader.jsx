function LectureHeader({
  lecture,
  module,
  progress,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between">

      {/* LEFT CONTENT */}
      <div>

        {/* MODULE LABEL */}
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
          Module • {module || "Module"}
        </p>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          {lecture?.title || "Lecture"}
        </h1>

        {/* OPTIONAL PROGRESS */}
        {progress !== undefined && (
          <p className="text-sm text-slate-400 mt-1">
            {progress}% completed
          </p>
        )}
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3">

        {/* SHARE BUTTON */}
        <button className="text-sm text-slate-500 hover:text-slate-700 transition">
          Share
        </button>

        {/* NEXT BUTTON */}
        <button
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition active:scale-95"
        >
          Next Lesson →
        </button>

      </div>

    </div>
  );
}

export default LectureHeader;