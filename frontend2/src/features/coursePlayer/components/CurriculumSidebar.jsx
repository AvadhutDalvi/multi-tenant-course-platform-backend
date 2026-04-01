import { useState, useEffect, useRef } from "react";

function CurriculumSidebar({
  modules,
  activeLectureId,
  completedIds,
  progress,
  onSelectLecture,
}) {
  const [openModule, setOpenModule] = useState(null);
  const activeRef = useRef(null);

  // auto scroll to active lecture
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeLectureId]);

  const toggleModule = (moduleName) => {
    setOpenModule((prev) => (prev === moduleName ? null : moduleName));
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold text-slate-800">
          Course Content
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {progress}% completed
        </p>
      </div>

      {/* MODULE LIST */}
      <div className="flex-1 overflow-y-auto">

        {Object.entries(modules).map(([moduleName, lectures], index) => (
          <div key={index} className="border-b">

            {/* MODULE HEADER */}
            <button
              onClick={() => toggleModule(moduleName)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition"
            >
              <span className="text-sm font-medium text-slate-700">
                {moduleName}
              </span>

              <span className="text-xs text-slate-400">
                {lectures.length} lectures
              </span>
            </button>

            {/* LECTURES */}
            {openModule === moduleName && (
              <div className="bg-slate-50">

                {lectures.map((lecture) => {
                  const isActive = lecture._id === activeLectureId;
                  const isCompleted = completedIds.includes(lecture._id);

                  return (
                    <div
                      key={lecture._id}
                      ref={isActive ? activeRef : null}
                      onClick={() => onSelectLecture(lecture._id)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition
                        ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >

                      {/* STATUS ICON */}
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-xs
                          ${
                            isCompleted
                              ? "bg-green-100 text-green-600"
                              : isActive
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-slate-200 text-slate-500"
                          }`}
                      >
                        {isCompleted ? "✓" : "▶"}
                      </div>

                      {/* TITLE */}
                      <span className="flex-1 truncate">
                        {lecture.title}
                      </span>

                    </div>
                  );
                })}

              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}

export default CurriculumSidebar;