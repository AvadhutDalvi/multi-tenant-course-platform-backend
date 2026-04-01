import { useState } from "react";

import NotesSection from "./NotesSection";
import MaterialsSection from "./MaterialSection";
import PracticeSection from "./PracticeSection";

function TabsSection({ lecture }) {
  const [activeTab, setActiveTab] = useState("notes");

  const tabs = [
    { key: "notes", label: "Notes" },
    { key: "resources", label: "Resources" },
    { key: "practice", label: "Practice" },
    { key: "discussion", label: "Discussion" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200">

      {/* TAB HEADER */}
      <div className="flex gap-6 border-b px-6 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`transition duration-200 active:scale-95 ${
              activeTab === tab.key
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="p-6">

        {activeTab === "notes" && (
          <NotesSection lecture={lecture} />
        )}

        {activeTab === "resources" && (
          <MaterialsSection materials={lecture?.materials || []} />
        )}

        {activeTab === "practice" && (
          <PracticeSection practiceSheet={lecture?.practiceSheet} />
        )}

        {activeTab === "discussion" && (
          <div className="text-slate-400">
            Discussion feature coming soon 🚀
          </div>
        )}

      </div>
    </div>
  );
}

export default TabsSection;