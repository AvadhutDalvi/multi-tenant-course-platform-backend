import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const ManageCourse = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/course/${courseId}`);
      setCourse(res.data.course);
      setLectures(res.data.course?.lectures || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLecture = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    try {
      setSubmitting(true);
      const res = await api.post(`/course/${courseId}/lecture`, {
        title: title.trim(),
        videoUrl: videoUrl.trim() || undefined,
      });
      setLectures(res.data.lectures ?? []);
      setTitle("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-gray-500">Course not found.</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Course</h1>
      </div>

      {/* Course Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>

      {/* Lecture List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lectures</h2>
        </div>
        {lectures.length === 0 ? (
          <p className="text-gray-500">No lectures yet. Add one below.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {lectures.map((lec) => (
              <li key={lec._id} className="py-3 flex items-center gap-3">
                <span className="font-medium">{lec.title}</span>
                {lec.videoUrl && (
                  <a
                    href={lec.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-black truncate max-w-xs"
                  >
                    {lec.videoUrl}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Lecture */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Add new lecture</h2>
        <form onSubmit={handleAddLecture} className="space-y-4 max-w-lg">
          <input
            type="text"
            placeholder="Lecture Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="url"
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Lecture"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageCourse;