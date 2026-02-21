import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const ManageCourse = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/course/${courseId}`);
      setCourse(res.data.course);
      setLectures(res.data.course?.lectures || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedUrl = videoUrl.trim();
    if (!trimmedTitle || !trimmedUrl) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.post(`/course/${courseId}/lecture`, {
        title: trimmedTitle,
        videoUrl: trimmedUrl,
      });
      setLectures(res.data.lectures ?? []);
      setTitle("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add lecture.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="text-gray-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-gray-600">Course not found.</div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Manage Course</h1>

      {/* Course overview — contextual, not interactive */}
      <section
        className="bg-white border border-gray-200 rounded-xl p-6 mb-8"
        aria-label="Course overview"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {course.title}
        </h2>
        {course.description && (
          <p className="text-gray-600 mb-3">{course.description}</p>
        )}
        <p className="text-gray-500 text-sm">
          Price: {course.price != null ? `₹${course.price}` : "—"}
        </p>
      </section>

      {/* Lecture list — core functional area */}
      <section
        className="bg-white border border-gray-200 rounded-xl p-6 mb-8"
        aria-label="Lectures"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lectures</h2>
        {lectures.length === 0 ? (
          <p className="text-gray-500 py-2">No lectures added yet.</p>
        ) : (
          <ol className="space-y-3 list-none pl-0">
            {lectures.map((lec, index) => (
              <li
                key={lec._id}
                className="flex gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-500 font-medium shrink-0 w-6">
                  {index + 1}.
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-gray-900">{lec.title}</span>
                  {lec.videoUrl && (
                    <a
                      href={lec.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-gray-500 hover:text-gray-700 truncate mt-0.5"
                    >
                      {lec.videoUrl}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Add lecture — action area */}
      <section
        className="bg-white border border-gray-200 rounded-xl p-6"
        aria-label="Add lecture"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add new lecture
        </h2>
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}
        <form onSubmit={handleAddLecture} className="space-y-4">
          <div>
            <label htmlFor="lecture-title" className="sr-only">
              Lecture title
            </label>
            <input
              id="lecture-title"
              type="text"
              placeholder="Lecture title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="lecture-video-url" className="sr-only">
              Video URL
            </label>
            <input
              id="lecture-video-url"
              type="url"
              placeholder="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? "Adding..." : "Add lecture"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ManageCourse;
