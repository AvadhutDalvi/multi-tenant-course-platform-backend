import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

function CreateChannel() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: null,
    banner: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const logoPreview = useMemo(() => {
    if (!form.logo) return "";
    return URL.createObjectURL(form.logo);
  }, [form.logo]);

  const bannerPreview = useMemo(() => {
    if (!form.banner) return "";
    return URL.createObjectURL(form.banner);
  }, [form.banner]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (field) => (event) => {
    const file = event.target.files?.[0] || null;
    setForm((current) => ({
      ...current,
      [field]: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);

      if (form.logo) {
        formData.append("logo", form.logo);
      }

      if (form.banner) {
        formData.append("banner", form.banner);
      }

      await api.post("/channel", formData);
      navigate("/dashboard/create-course");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create channel.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <section className="w-full max-w-5xl rounded-[34px] bg-white px-7 py-8 shadow-sm shadow-slate-200/80 md:px-10 md:py-9">
        <div className="max-w-3xl">
          <h1 className="text-[2.6rem] font-semibold tracking-tight text-slate-950">
            Create Your Channel
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Set up your teaching identity and start publishing courses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <label className="block">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Channel Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Masterclass of Modern Design"
              className="h-16 w-full rounded-2xl border border-transparent bg-[#f6f7fb] px-5 text-base text-slate-900 outline-none transition placeholder:text-[#a7b5d4] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              required
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Description
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell your students about your teaching philosophy and what they can expect from your courses..."
              className="h-44 w-full resize-none rounded-2xl border border-transparent bg-[#f6f7fb] px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-[#a7b5d4] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              required
            />
          </label>

          <div className="grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start">
            <div>
              <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Upload Logo
              </span>
              <label className="flex h-[190px] w-[190px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-slate-200 bg-[#f7f8fb] text-center transition hover:border-indigo-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange("logo")}
                  className="hidden"
                />

                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-indigo-600">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                        <path d="M8 12.5 12 8.5l4 4M12 9v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 15.5a3.5 3.5 0 0 0-.66-6.94 5 5 0 0 0-9.71-1.26A4 4 0 0 0 6 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-600">Drop or Click</p>
                  </div>
                )}
              </label>
            </div>

            <div>
              <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Upload Banner
              </span>
              <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-slate-200 bg-[#f7f8fb] px-6 py-8 text-center transition hover:border-indigo-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange("banner")}
                  className="hidden"
                />

                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="h-full w-full rounded-[20px] object-cover"
                  />
                ) : (
                  <>
                    <div className="text-indigo-600">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 15.5 11 12l2.5 3 2.5-3 3 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="9" cy="9" r="1.4" fill="currentColor" />
                      </svg>
                    </div>
                    <p className="mt-5 text-lg font-medium text-slate-700">
                      Drag and drop channel banner image
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Recommended: 1920×1080 (Max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-w-[230px] items-center justify-center gap-3 rounded-[22px] bg-indigo-600 px-8 py-5 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{submitting ? "Creating..." : "Create Channel"}</span>
              <span className="text-xl leading-none">→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateChannel;
