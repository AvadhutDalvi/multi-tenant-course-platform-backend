import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth.js";
import api from "../../../services/api.js";

function ChannelPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [purchaseLoadingId, setPurchaseLoadingId] = useState(null);
  const [purchaseErrors, setPurchaseErrors] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/channel/${slug}`);
        const data = response.data?.channel || {};
        setChannel(data);
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load channel.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [slug]);

  useEffect(() => {
    if (user?.role !== "student") {
      setEnrolledIds([]);
      return;
    }

    const fetchEnrolled = async () => {
      try {
        const response = await api.get("/course/enrolled");
        const enrolledCourses = response.data?.courses || [];
        setEnrolledIds(enrolledCourses.map((course) => course._id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchEnrolled();
  }, [user?.role]);

  const handlePurchase = async (courseId) => {
    try {
      setPurchaseLoadingId(courseId);
      setPurchaseErrors((current) => ({ ...current, [courseId]: undefined }));

      await api.post("/course/purchase", { courseId });

      setEnrolledIds((current) =>
        current.includes(courseId) ? current : [...current, courseId],
      );
    } catch (err) {
      if (err.response?.status === 400) {
        setEnrolledIds((current) =>
          current.includes(courseId) ? current : [...current, courseId],
        );
      } else {
        setPurchaseErrors((current) => ({
          ...current,
          [courseId]: err.response?.data?.message || "Failed to enroll in this course.",
        }));
      }
    } finally {
      setPurchaseLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading channel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Channel not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </button>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="h-24 w-24 rounded-[1.5rem] object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-slate-100 text-3xl font-bold text-slate-500">
              {channel.name?.[0]?.toUpperCase() || "C"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{channel.name}</h1>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                @{channel.slug}
              </span>
            </div>
            {channel.description ? (
              <p className="mt-3 max-w-3xl text-sm text-slate-600">{channel.description}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Published courses
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Courses by {channel.name}
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {courses.length} {courses.length === 1 ? "course" : "courses"}
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            No courses published for this channel yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const isEnrolled = enrolledIds.includes(course._id);
              const isProcessing = purchaseLoadingId === course._id;
              const priceNumber =
                typeof course.price === "number" ? course.price : Number(course.price) || 0;
              const isFree = priceNumber === 0;

              return (
                <article
                  key={course._id}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-40 bg-gradient-to-br from-sky-100 via-white to-indigo-100" />
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {course.description || "Course details will appear here."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {isFree ? "Free" : `₹${priceNumber}`}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          isEnrolled
                            ? navigate(`/dashboard/course/${course._id}`)
                            : handlePurchase(course._id)
                        }
                        disabled={isProcessing || (!isEnrolled && user?.role !== "student")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
                          isEnrolled
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-slate-900 hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        }`}
                      >
                        {isProcessing
                          ? "Processing..."
                          : isEnrolled
                            ? "Continue"
                            : isFree
                              ? "Enroll Free"
                              : "Buy Now"}
                      </button>
                    </div>

                    {user?.role !== "student" && !isEnrolled ? (
                      <p className="text-xs text-slate-500">
                        Student account required to enroll in a course.
                      </p>
                    ) : null}

                    {purchaseErrors[course._id] ? (
                      <p className="text-xs text-red-600">{purchaseErrors[course._id]}</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ChannelPage;
