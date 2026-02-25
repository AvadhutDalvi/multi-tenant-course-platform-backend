import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const q = new URLSearchParams(location.search).get("q");
    return (q || "").trim();
  }, [location.search]);

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        setError(null);
        setChannels([]);

        if (!query) {
          setLoading(false);
          return;
        }

        const res = await api.get(`/channels/search?q=${encodeURIComponent(query)}`);
        setChannels(res.data.channels || []);
      } catch (err) {
        console.error(err);
        setError("Failed to search channels.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [query]);

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Search Channels</h1>
        {query && (
          <p className="text-gray-600 mt-2">
            Found {channels.length} channels for{" "}
            <span className="font-medium text-gray-900">‘{query}’</span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="min-h-[240px] flex items-center justify-center">
          <p className="text-gray-600">Searching channels...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Failed to search channels.
        </div>
      ) : !query ? (
        <div className="min-h-[240px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-900 font-semibold">Search for a channel</p>
            <p className="text-gray-600 text-sm mt-1">
              Use the search bar to find educator channels.
            </p>
          </div>
        </div>
      ) : channels.length === 0 ? (
        <div className="min-h-[240px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-900 font-semibold">
              No channels found for ‘{query}’
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Try searching with a different keyword.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {channels.map((ch) => (
            <div
              key={ch._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 min-w-0">
                {ch.logo ? (
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 shrink-0" />
                )}

                <div className="min-w-0">
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {ch.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">@{ch.slug}</p>
                  {ch.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {ch.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/dashboard/channel/${ch.slug}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
              >
                View Channel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;