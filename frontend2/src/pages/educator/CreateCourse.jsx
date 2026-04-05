import { useMemo, useState,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const checkChannel = async () => {
    try {
      await api.get("/channel/me"); // 👈 check if channel exists
    } catch (err) {
      if (err.response?.status === 404) {
        navigate("/dashboard/create-channel"); // ✅ redirect
      }
    }
  };

  checkChannel();
}, []);

  const previewUrl = useMemo(() => {
    if (!form.image) return "";
    return URL.createObjectURL(form.image);
  }, [form.image]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((current) => ({
      ...current,
      image: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);

      if (form.image) {
        formData.append("image", form.image);
      }

      await api.post("/course/create", formData);
      navigate("/dashboard/instructor/courses");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-400">
        <span>Dashboard</span>
        <span className="mx-2">›</span>
        <span>Courses</span>
        <span className="mx-2">›</span>
        <span className="font-semibold text-slate-900">Create New Course</span>
      </div>

      <section className="rounded-[34px] bg-white px-7 py-8 shadow-sm shadow-slate-200/80 md:px-8 md:py-9 xl:px-10">
        <div className="max-w-3xl">
          <h1 className="text-[2.2rem] font-semibold tracking-tight text-slate-950">
            Create New Course
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Add basic details to start building your course
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="grid gap-8 xl:grid-cols-[1fr_1.05fr]">
            <div className="space-y-8">
              <label className="block">
                <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Course Title
                </span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Mastering Modern Typography"
                  className="h-16 w-full rounded-2xl border border-indigo-500 bg-[#f6f7fb] px-5 text-base text-slate-900 outline-none transition placeholder:text-[#a7b5d4] focus:ring-4 focus:ring-indigo-100"
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
                  placeholder="Deep dive into the world of type design and visual hierarchy..."
                  className="h-40 w-full resize-none rounded-2xl border border-transparent bg-[#f6f7fb] px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-[#a7b5d4] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </label>

              <label className="block max-w-xs">
                <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Price (USD)
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="$ 0.00"
                  className="h-16 w-full rounded-2xl border border-transparent bg-[#f6f7fb] px-5 text-base text-slate-900 outline-none transition placeholder:text-[#a7b5d4] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </label>
            </div>

            <div className="space-y-5">
              <div>
                <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Thumbnail Upload
                </span>
                <label className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-slate-200 bg-[#f7f8fb] px-6 py-8 text-center transition hover:border-indigo-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Thumbnail preview"
                      className="h-full w-full rounded-[20px] object-cover"
                    />
                  ) : (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm shadow-slate-200">
                        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                          <path d="M8 12.5 12 8.5l4 4M12 9v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 15.5a3.5 3.5 0 0 0-.66-6.94 5 5 0 0 0-9.71-1.26A4 4 0 0 0 6 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <p className="mt-5 text-xl font-semibold text-slate-900">
                        Click or drag to upload
                      </p>
                      <p className="mt-3 text-sm text-slate-400">
                        Recommended: 16:9 ratio, min. 1280×720px
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[#f7f6ff] px-4 py-4 text-sm leading-6 text-indigo-400">
                <span className="mt-0.5 text-indigo-500">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 10v5M12 7.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <p>
                  A high-quality thumbnail increases enrollment by up to 40%.
                  Ensure your imagery is clear and relevant.
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="mt-14 flex flex-col-reverse gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              disabled={submitting}
              className="px-5 py-3 text-base font-semibold text-indigo-600 transition hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-w-[160px] items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateCourse;
