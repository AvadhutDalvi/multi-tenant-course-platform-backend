import React from "react";

function MaterialsSection({ materials }) {
  if (!materials || materials.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Study Materials
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {materials.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <span className="text-gray-800 truncate">{item.title}</span>
            <span className="text-xs text-gray-500 ml-3 shrink-0">
              View
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default MaterialsSection;

