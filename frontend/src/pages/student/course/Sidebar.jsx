import { useState } from "react";
import { card } from "../../../styles/theme";

function Sidebar({
  course,
  modules,
  activeLectureId,
  completedIds,
  progress,
  onSelectLecture,
}) {
  const [openModule, setOpenModule] = useState(
    Object.keys(modules)[0] || null
  );

  const toggleModule = (moduleName) => {
    setOpenModule((prev) =>
      prev === moduleName ? null : moduleName
    );
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col">

      {/* COURSE HEADER */}
      <div className="p-4 border-b">
        <h2 className="text-sm font-bold text-slate-900 line-clamp-2">
          {course?.title}
        </h2>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-sky-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* MODULES */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">

        {Object.entries(modules).map(([moduleName, lectures]) => (
          <div key={moduleName} className={`${card}`}>

            {/* MODULE HEADER */}
            <button
              onClick={() => toggleModule(moduleName)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 rounded-lg transition"
            >
              <span className="text-sm font-semibold text-slate-800">
                {moduleName}
              </span>

              <span className="text-xs text-slate-400">
                {lectures.length}
              </span>
            </button>

            {/* LECTURES */}
            {openModule === moduleName && (
              <div className="border-t border-slate-100">

                {lectures.map((lec) => {
                  const isActive = activeLectureId === lec._id;
                  const isCompleted = completedIds.includes(lec._id);

                  return (
                    <button
                      key={lec._id}
                      onClick={() => onSelectLecture(lec._id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition
                        
                        ${
                          isActive
                            ? "bg-sky-100 text-sky-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {/* STATUS ICON */}
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-xs
                          ${
                            isCompleted
                              ? "bg-green-100 text-green-600"
                              : isActive
                              ? "bg-sky-200 text-sky-700"
                              : "bg-slate-200 text-slate-400"
                          }
                        `}
                      >
                        {isCompleted ? "✓" : "▶"}
                      </div>

                      {/* TITLE */}
                      <span className="flex-1 truncate">
                        {lec.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;