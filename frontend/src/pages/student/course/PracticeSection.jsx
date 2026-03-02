import React from "react";

function PracticeSection({ practiceSheet }) {
  if (!practiceSheet || !practiceSheet.url) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Practice Sheet
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        {practiceSheet.title || "Practice assignment for this lecture."}
      </p>
      <a
        href={practiceSheet.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black"
      >
        View / Download
      </a>
    </section>
  );
}

export default PracticeSection;

