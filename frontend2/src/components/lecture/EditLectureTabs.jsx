import { useEffect, useState } from "react";

const tabs = [
  { id: "basics", label: "Basics" },
  { id: "media", label: "Media" },
  { id: "materials", label: "Materials" },
  { id: "practice", label: "Practice" },
];

function EditLectureTabs() {
  const [activeTab, setActiveTab] = useState("basics");

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = null;

      for (const tab of tabs) {
        const section = document.getElementById(tab.id);
        if (!section) continue;

        if (section.getBoundingClientRect().top <= 180) {
          currentSection = tab;
        }
      }

      if (currentSection) {
        setActiveTab(currentSection.id);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (id) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="sticky top-4 z-20 mt-6 rounded-full border border-white/80 bg-white/90 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EditLectureTabs;
