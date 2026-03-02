import React from "react";

function ActionBar({ course, lecture, progress, onMarkComplete, isCompleted }) {
  if (!lecture) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">
          Lecture {lecture.order}
        </p>
        <p className="text-sm font-medium text-gray-900">
          {lecture.title}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <p className="text-xs text-gray-500 mb-1">Overall progress</p>
          <div className="w-40 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onMarkComplete}
          disabled={isCompleted}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
            isCompleted
              ? "bg-green-500 cursor-default"
              : "bg-gray-900 hover:bg-black"
          }`}
        >
          {isCompleted ? "Completed" : "Mark as Complete"}
        </button>
      </div>
    </section>
  );
}

export default ActionBar;

