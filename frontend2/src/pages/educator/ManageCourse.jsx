import { useParams,useNavigate } from "react-router-dom";
import api from "../../services/api";


import { useState, useEffect } from "react";



function DotsGridIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="4" r="1.1" />
      <circle cx="5" cy="8" r="1.1" />
      <circle cx="5" cy="12" r="1.1" />
      <circle cx="10.8" cy="4" r="1.1" />
      <circle cx="10.8" cy="8" r="1.1" />
      <circle cx="10.8" cy="12" r="1.1" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.3 8.9L15.2 12l-4.9 3.1V8.9Z" fill="currentColor" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6 8V6h12v2h-5v10h-2V8H6Zm7 4h5v2h-1.5v4h-2v-4H13v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M2.7 12s3.4-5 9.3-5 9.3 5 9.3 5-3.4 5-9.3 5-9.3-5-9.3-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M4 16.8V20h3.2L17.7 9.5 14.5 6.3 4 16.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12.9 7.9l3.2 3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.8 7l1.6-1.6a1.7 1.7 0 0 1 2.4 0l.8.8a1.7 1.7 0 0 1 0 2.4L17 10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5.5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="18.5" r="1.7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 4v4M16 4v4M4 10h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l2.8 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ManageCourse() {

  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);;

  const navigate=useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data;

        console.log("API RESPONSE:", data);

        if (data.course) {
          setCourse(data.course);
          setLectures(data.course.lectures || []);
        }

      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  console.log(courseId);
  if (!course) {
    return <div className="p-6">Loading course...</div>;
  }

  console.log(course);

  return (
    <div className="min-h-screen bg-[#fbfbfe] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        {/* the main top bar with title and image  */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
          <div className="pt-1">
            <div className="mb-3 flex items-center gap-4">
              <span className="rounded-full bg-[#DDF7E8] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#6DB68A]">
                Published
              </span>
              <span className="text-[24px] font-medium tracking-[-0.02em] text-[#8D98B3]">

              </span>
            </div>

            <h1 className="max-w-[760px] text-[30px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#111827] sm:text-[38px]">
              {course?.title}
            </h1>

            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-[#5F6B84]">
              {course?.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-full border border-[#5B4CF0] bg-white px-5 py-2 text-sm font-semibold text-[#5748EE] transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Edit Course
              </button>
              <button
                type="button"
                className="rounded-full bg-[#4F35F4] px-5 py-2 text-sm font-semibold tracking-[-0.03em] text-white shadow-[0_10px_24px_rgba(79,53,244,0.24)] transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Publish Course
              </button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[240px]">
            <div className="relative h-[170px] overflow-hidden rounded-[28px] shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl cursor-pointer">

              {/* IMAGE */}
              <img
                src={course?.image}
                alt="Course Thumbnail"
                className="h-full w-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.14),transparent_38%),linear-gradient(180deg,rgba(9,58,63,0.12),rgba(8,39,44,0.16))]" />

              {/* TEXT */}
              <div className="absolute right-5 top-3 text-[24px] font-semibold uppercase tracking-[0.08em] text-white/80">
                Course
              </div>

              <div className="absolute left-4 top-[114px] rounded-full bg-white/95 px-4 py-1.5 text-[10px] font-semibold text-[#6557EF] shadow-sm">
                Preview Thumbnail
              </div>

            </div>
          </div>
        </section>

        {/* PROGRESS SECTION */}
        <section className="mt-10 rounded-[30px] bg-white px-6 py-5 shadow-[0_10px_32px_rgba(17,24,39,0.04)] ring-1 ring-[#F0F2F7] sm:px-6">

          {/* LOGIC */}
          {(() => {
            const totalLectures = 12; // later replace with course.totalLectures
            const completedLectures = lectures.length;

            const progressPercent = totalLectures
              ? Math.round((completedLectures / totalLectures) * 100)
              : 0;

            return (
              <>
                {/* HEADER */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#8C97AE]">
                      Current Progress
                    </p>

                    <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.03em] text-[#111827]">
                      {completedLectures} / {totalLectures} lectures added
                    </h2>
                  </div>

                  {/* STATUS */}
                  <div className="flex items-center gap-2 self-start text-[16px] font-semibold text-[#4FB679] lg:self-auto">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#36C86B]" />
                    <span>
                      {progressPercent === 100
                        ? "Course is Published"
                        : "Course is in Progress"}
                    </span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#ECDDFF]">
                  <div
                    className="h-full rounded-full bg-[#6335F6]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </>
            );
          })()}

        </section>

        {/* Lecture Management */}
        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[#111827]">
                Lecture Management
              </h2>

              <button
                type="button"
                onClick={()=>navigate(`/dashboard/educator/add-lecture/${courseId}`)}
                className="inline-flex items-center gap-2 text-[22px] font-semibold tracking-[-0.03em] text-[#5A48F2] transition-all duration-200 ease-out hover:shadow-[0_14px_32px_rgba(17,24,39,0.08)] hover:scale-[1.03]"
              >
                {/* <PlusCircleIcon /> */}
                <span> + Add Lecture</span>
              </button>
            </div>

            <div className="space-y-4">
              {lectures.map((lecture) => (
                <article
                  key={lecture.id}
                  className="flex items-center gap-3 rounded-[24px] bg-white px-5 py-3 shadow-[0_10px_26px_rgba(17,24,39,0.04)] ring-1 ring-[#F2F3F7] transition-all duration-200 ease-out hover:shadow-[0_14px_32px_rgba(17,24,39,0.08)] hover:scale-[1.03]"
                >
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-[#C8CEDD]">
                      <DotsGridIcon />
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F6FB] text-[#5446EE]">
                      {lecture.iconType === "text" ? <TextIcon /> : <PlayCircleIcon />}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[16px] font-semibold tracking-[-0.03em] text-[#1B2434]">
                      {lecture.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[13px] font-medium text-[#9CA6BE]">
                      <span>{lecture.module}</span>
                      <span className="text-[#D1D6E3]">&bull;</span>
                      <span className="inline-flex items-center gap-1.5">
                        <ClockIcon />
                        {lecture.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      className="flex items-center items-center justify-center rounded-xl text-[#5C667E] transition-all duration-200 ease-out hover:scale-105 hover:bg-gray-100 hover:shadow-md active:scale-95"
                      aria-label={`Preview ${lecture.title}`}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      type="button"
                      className={`flex items-center items-center justify-center rounded-xl ${lecture.editColor} transition-all duration-200 ease-out hover:scale-105 hover:bg-gray-100 hover:shadow-md active:scale-95`}
                      aria-label={`Edit ${lecture.title}`}
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      className="flex items-center items-center justify-center rounded-xl text-[#5C667E] transition-all duration-200 ease-out hover:scale-105 hover:bg-gray-100 hover:shadow-md active:scale-95"
                      aria-label={`More options for ${lecture.title}`}
                    >
                      <MoreIcon />
                    </button>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${lecture.status === "published"
                      ? "bg-green-100 text-green-600"
                      : lecture.status === "review"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {lecture.status}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[30px] bg-[#FAFAFD] px-6 py-6 shadow-[0_10px_26px_rgba(17,24,39,0.04)] ring-1 ring-[#F1F2F6]">
            <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[#1B2434]">
              Course Settings
            </h2>

            <div className="mt-8 space-y-8">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#B0B8CA]">
                  Pricing
                </p>
                <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#111827]">
                  $89.00
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#B0B8CA]">
                    Status
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 text-[16px] font-semibold text-[#45BB72]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#37C86C]" />
                    <span>Published</span>
                  </div>
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#B0B8CA]">
                    Category
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-[#374151]">Design</p>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#B0B8CA]">
                  Last Updated
                </p>
                <div className="mt-2 inline-flex items-center gap-2 text-[16px] font-semibold text-[#4B5563]">
                  <span className="text-[#B6BECE]">
                    <CalendarIcon />
                  </span>
                  <span>Oct 24, 2024</span>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button
                type="button"
                className="w-full rounded-full border border-[#E1E5EF] bg-white px-6 py-4 text-[16px] font-semibold tracking-[-0.02em] text-[#374151]"
              >
                Course Analytics
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-[#F4CDD3] bg-white px-6 py-4 text-[16px] font-semibold tracking-[-0.02em] text-[#E35C6B]"
              >
                Unpublish Course
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default ManageCourse;
