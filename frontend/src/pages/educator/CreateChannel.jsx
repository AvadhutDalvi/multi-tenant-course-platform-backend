import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function CreateChannel() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      await api.post("/channel", {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        logo: logo.trim() || undefined,
      });

      navigate("/dashboard/create-course");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create channel.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Create Channel</h1>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Channel Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g. Modern Web Academy"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g. modern-web-academy"
          />
          <p className="mt-1 text-xs text-gray-500">
            Used in URLs. Leave empty to auto-generate from the name.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Short description of your channel."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? "Creating..." : "Create Channel"}
        </button>
      </form>
    </div>
  );
}

export default CreateChannel;

