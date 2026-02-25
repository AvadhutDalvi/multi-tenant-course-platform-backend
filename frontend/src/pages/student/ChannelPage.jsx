import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ChannelPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [enrolledIds, setEnrolledIds] = useState([]);
  const [purchaseLoadingId, setPurchaseLoadingId] = useState(null);
  const [purchaseErrors, setPurchaseErrors] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/channel/${slug}`);
        const data = res.data?.channel || {};
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
    const fetchEnrolled = async () => {
      try {
        const res = await api.get("/course/enrolled");
        const enrolledCourses = res.data?.courses || [];
        setEnrolledIds(enrolledCourses.map((c) => c._id));
      } catch (err) {
        // Silent fail; enrollment state just won't be pre-populated
        console.error(err);
      }
    };

    fetchEnrolled();
  }, []);

  const handlePurchase = async (courseId) => {
    try {
      setPurchaseLoadingId(courseId);
      setPurchaseErrors((prev) => ({ ...prev, [courseId]: undefined }));

      await api.post("/course/purchase", { courseId });

      setEnrolledIds((prev) =>
        prev.includes(courseId) ? prev : [...prev, courseId]
      );
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        // Already purchased – treat as enrolled
        setEnrolledIds((prev) =>
          prev.includes(courseId) ? prev : [...prev, courseId]
        );
      } else {
        const message =
          err.response?.data?.message || "Failed to enroll in this course.";
        setPurchaseErrors((prev) => ({ ...prev, [courseId]: message }));
      }
    } finally {
      setPurchaseLoadingId(null);
    }
  };

  const totalCourses = courses.length;
  const freeCount = courses.filter((c) => !c.price || Number(c.price) === 0).length;
  const paidCount = Math.max(totalCourses - freeCount, 0);

  if (loading) {
    return (
      <div className="max-w-5xl min-h-[240px] flex items-center justify-center">
        <p className="text-gray-600">Loading channel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="max-w-5xl min-h-[240px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-semibold">Channel not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-10">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"
      >
        <span aria-hidden="true">←</span>
        <span>Back to Search</span>
      </button>

      {/* Channel header card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex items-start gap-6">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-24 h-24 rounded-xl object-cover border border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
            {channel.name?.[0]?.toUpperCase() || "C"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {channel.name}
            </h1>
            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              @{channel.slug}
            </span>
          </div>

          {channel.description && (
            <p className="text-sm text-gray-600 mt-3 max-w-3xl">
              {channel.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-6 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            <div>
              <span className="block text-gray-400">Courses</span>
              <span className="text-gray-900 text-sm normal-case font-semibold">
                {totalCourses}
              </span>
            </div>
            <div>
              <span className="block text-gray-400">Free</span>
              <span className="text-gray-900 text-sm normal-case font-semibold">
                {freeCount}
              </span>
            </div>
            <div>
              <span className="block text-gray-400">Paid</span>
              <span className="text-gray-900 text-sm normal-case font-semibold">
                {paidCount}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Courses section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Courses by {channel.name}
          </h2>
          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {totalCourses} {totalCourses === 1 ? "course" : "courses"}
          </span>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No courses published for this channel yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => {
              const priceNumber =
                typeof course.price === "number"
                  ? course.price
                  : Number(course.price) || 0;
              const isFree = priceNumber === 0;
              const isEnrolled = enrolledIds.includes(course._id);

              const topBadgeLabel = isFree
                ? "FREE"
                : `₹${priceNumber.toLocaleString()}`;

              const bottomPriceLabel = isFree
                ? "Free"
                : `₹${priceNumber.toLocaleString()}`;

              let buttonLabel = "View Course";
              if (isEnrolled) {
                buttonLabel = "Enrolled";
              } else if (isFree) {
                buttonLabel = "Enroll Free";
              } else {
                buttonLabel = "Buy Now";
              }

              const isProcessing = purchaseLoadingId === course._id;

              return (
                <div
                  key={course._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden"
                >
                  <div className="relative">
                    {course.imageURL ? (
                      <img
                        src={course.imageURL}
                        alt={course.title}
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-100" />
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full text-white ${
                          isFree ? "bg-green-500" : "bg-gray-900"
                        }`}
                      >
                        {topBadgeLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <p
                        className={`text-sm font-semibold ${
                          isFree ? "text-green-600" : "text-gray-900"
                        }`}
                      >
                        {bottomPriceLabel}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          isEnrolled
                            ? navigate(`/dashboard/course/${course._id}`)
                            : handlePurchase(course._id)
                        }
                        disabled={!!isEnrolled || isProcessing}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                          isEnrolled
                            ? "bg-green-500 cursor-default"
                            : "bg-gray-900 hover:bg-black"
                        }`}
                      >
                        {isProcessing ? "Processing..." : buttonLabel}
                      </button>
                    </div>

                    {purchaseErrors[course._id] && (
                      <p className="mt-2 text-xs text-red-600">
                        {purchaseErrors[course._id]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ChannelPage;
