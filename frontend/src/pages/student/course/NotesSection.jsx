import React, { useState } from "react";

function NotesSection() {
  const [notes, setNotes] = useState("");

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">My Notes</h3>
        <span className="text-xs text-gray-400">Private</span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes for this lecture..."
        className="w-full min-h-[100px] text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-y"
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Save Note
        </button>
      </div>
    </section>
  );
}

export default NotesSection;

