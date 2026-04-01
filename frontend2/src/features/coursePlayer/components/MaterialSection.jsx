function getFileType(url = "") {
  const ext = url.split(".").pop().toLowerCase();

  if (["pdf"].includes(ext)) return "PDF";
  if (["zip", "rar"].includes(ext)) return "ZIP";
  if (["mp4"].includes(ext)) return "VIDEO";

  return "FILE";
}

function MaterialsSection({ materials }) {
  if (!materials || materials.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No resources available.
      </p>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h2 className="text-lg font-semibold text-slate-800">
        Resources
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">

        {materials.map((item, index) => {
          const fileType = getFileType(item.url);

          return (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm hover:border-slate-300 transition"
            >

              {/* ICON */}
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 text-sm font-semibold">
                {fileType}
              </div>

              {/* INFO */}
              <div className="flex-1">

                <p className="text-sm font-medium text-slate-800 truncate">
                  {item.title || "Resource File"}
                </p>

                {/* <p className="text-xs text-slate-400">
                  {getFileSize(item.size) || "File"}
                </p> */}

              </div>

            </a>
          );
        })}

      </div>

    </div>
  );
}

export default MaterialsSection;
