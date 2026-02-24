import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function EducatorDashboard() {
  const [channel, setChannel] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missingChannel, setMissingChannel] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setMissingChannel(false);

        const channelRes = await api.get("/channel/me");
        setChannel(channelRes.data.channel);

        const coursesRes = await api.get("/course/creator");
        setCourses(coursesRes.data.courses || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setMissingChannel(true);
        } else {
          console.error(err);
          setError(err.response?.data?.message || "Failed to load dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  if (missingChannel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Create Your Channel</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Before creating courses, you need to create your educator channel.
          </p>
          <button
            onClick={() => navigate("/dashboard/create-channel")}
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium"
          >
            Create Channel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Educator Dashboard</h1>
        <p className="text-gray-600 text-sm">
          Manage your channel and courses.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Channel overview */}
      {channel && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {channel.name}
              </h2>
              {channel.description && (
                <p className="text-gray-600 text-sm mb-2">
                  {channel.description}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Slug: <span className="font-mono">{channel.slug}</span>
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-black"
              disabled
            >
              Edit Channel
            </button>
          </div>
        </section>
      )}

      {/* My courses section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
          <button
            onClick={() => navigate("/dashboard/create-course")}
            className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No courses created yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <h3 className="text-base font-semibold mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <button
                  onClick={() =>
                    navigate(`/dashboard/manage-course/${course._id}`)
                  }
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EducatorDashboard;

