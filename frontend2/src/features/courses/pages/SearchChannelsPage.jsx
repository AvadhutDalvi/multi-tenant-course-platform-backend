import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

function SearchChannelsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => {
    const value = new URLSearchParams(location.search).get("q");
    return (value || "").trim();
  }, [location.search]);

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchChannels = async () => {
      try {
        setLoading(true);
        setError("");
        setChannels([]);

        if (!query) {
          setLoading(false);
          return;
        }

        const response = await api.get(`/channels/search?q=${encodeURIComponent(query)}`);

        if (!isMounted) return;
        setChannels(response.data.channels || []);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError("Failed to search channels.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchChannels();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          Channel search
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Search Results</h1>
        <p className="mt-2 text-sm text-slate-500">
          {query ? `Found ${channels.length} channels for "${query}".` : "Use the dashboard search bar to find educator channels."}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Searching channels...</p>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !query ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          Search for a channel to see matching educators.
        </div>
      ) : channels.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          No channels found for "{query}".
        </div>
      ) : (
        <div className="space-y-4">
          {channels.map((channel) => (
            <article
              key={channel._id}
              className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-slate-100" />
                )}

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{channel.name}</h2>
                  <p className="text-sm text-slate-500">@{channel.slug}</p>
                  {channel.description ? (
                    <p className="mt-1 text-sm text-slate-600">{channel.description}</p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/dashboard/channel/${channel.slug}`)}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                View channel
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchChannelsPage;
