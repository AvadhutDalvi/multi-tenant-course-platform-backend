import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { btnPrimary, card, cardHover, inputStyle } from "../../styles/theme";

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
    <form
      onSubmit={handleSubmit}
      className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex items-center gap-3"
    >
      <div className="flex items-center text-gray-400">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 4a7 7 0 015.657 11.243l2.55 2.55a1 1 0 01-1.414 1.414l-2.55-2.55A7 7 0 1111 4zm0 2a5 5 0 100 10A5 5 0 0011 6z"
            fill="currentColor"
          />
        </svg>
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search for courses or channels..."
        className={` flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400`}
      />
      <button
        type="submit"
        className={`${btnPrimary} px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
      >
        Search
      </button>
    </form>
  );
}

export default GlobalSearchBar;

