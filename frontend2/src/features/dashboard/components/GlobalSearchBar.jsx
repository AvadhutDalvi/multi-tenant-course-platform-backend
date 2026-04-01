import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GlobalSearchBar() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;

    navigate(`/dashboard/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl flex-1">
      {/* Icon */}
      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M11 4a7 7 0 0 1 5.657 11.243l2.55 2.55a1 1 0 1 1-1.414 1.414l-2.55-2.55A7 7 0 1 1 11 4Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </span>

      {/* Input */}
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search for courses, mentors, or resources..."
        className="w-full rounded-full border border-white bg-white/90 py-3 pl-12 pr-5 text-sm text-slate-700 shadow-sm outline-none focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100"
      />
    </form>
  );
}

export default GlobalSearchBar;