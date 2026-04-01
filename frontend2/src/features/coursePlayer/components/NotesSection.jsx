import { useState } from "react";

function NotesSection() {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);

  const handleSave = () => {
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now(),
      text: noteText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setNotes((prev) => [newNote, ...prev]);
    setNoteText("");
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">
          Lecture Notes
        </h2>
        <button className="text-sm text-indigo-600 hover:underline">
          + Create New Note
        </button>
      </div>

      {/* NOTE INPUT */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type your notes here... Your progress is automatically saved."
          className="w-full h-28 resize-none outline-none text-sm text-slate-700 placeholder-slate-400"
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {noteText ? "Unsaved note..." : ""}
          </span>

          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* SAVED NOTES */}
      <div className="space-y-4">

        {notes.length === 0 ? (
          <p className="text-sm text-slate-400">
            No notes yet. Start writing!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">

                {/* TIME BADGE */}
                <div className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
                  {note.time}
                </div>

                {/* CONTENT */}
                <div className="text-sm text-slate-700 leading-relaxed">
                  {note.text}
                </div>

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default NotesSection;
