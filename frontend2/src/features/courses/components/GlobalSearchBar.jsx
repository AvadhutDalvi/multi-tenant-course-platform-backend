import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GlobalSearchBar() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;
    navigate(`/dashboard/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-3 rounded-[1.25rem] bg-white px-4 py-3">
        <svg
          className="h-5 w-5 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 4a7 7 0 015.657 11.243l2.55 2.55a1 1 0 01-1.414 1.414l-2.55-2.55A7 7 0 1111 4zm0 2a5 5 0 100 10A5 5 0 0011 6z"
            fill="currentColor"
          />
        </svg>
        <input
          type="text"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search educator channels..."
          className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
      <button
        type="submit"
        className="rounded-[1.25rem] bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        Search
      </button>
    </form>
  );
}

export default GlobalSearchBar;
