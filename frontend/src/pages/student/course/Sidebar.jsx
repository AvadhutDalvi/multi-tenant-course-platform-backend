import React from "react";

function Sidebar({ course, modules, activeLectureId, completedIds, progress, onSelectLecture }) {
  const completedCount = completedIds.length;
  const totalLectures = Object.values(modules).reduce(
    (sum, list) => sum + list.length,
    0
  );

  return (
    <aside className="w-72 flex-shrink-0 space-y-4">
      {/* Course title & progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h1 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h1>
        <p className="text-xs text-gray-500 mb-2">
          Your progress
        </p>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-600 flex justify-between">
          <span>
            {completedCount} done · {Math.max(totalLectures - completedCount, 0)} left
          </span>
          <span className="font-medium">{Math.round(progress || 0)}%</span>
        </p>
      </div>

      {/* Modules & lectures */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 max-h-[70vh] overflow-y-auto">
        {Object.entries(modules).map(([moduleName, lectures]) => (
          <div key={moduleName} className="mb-3 last:mb-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {moduleName}
            </p>
            <div className="space-y-1">
              {lectures.map((lecture) => {
                const isActive = lecture._id === activeLectureId;
                const isCompleted = completedIds.includes(lecture._id);
                return (
                  <button
                    key={lecture._id}
                    type="button"
                    onClick={() => onSelectLecture(lecture._id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {isCompleted ? "✓" : ""}
                      </div>
                      <span className="truncate">{lecture.title}</span>
                    </div>
                    {lecture.duration && (
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {lecture.duration}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

