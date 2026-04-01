import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnrolledCourses } from "../../features/courses/hooks/useEnrolledCourses.js";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

function ProgressBars({ courses }) {
  const columns = courses.map((c) => c.progress || 0).slice(0, 7);
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="mt-5">
      <div className="flex items-end gap-2">
        {columns.map((value, index) => (
          <div key={days[index]} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-16 w-full items-end rounded-full bg-indigo-50 p-1">
              <div
                className="w-full rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400"
                style={{ height: `${value}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {days[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedCourse({ course, navigate }) {
  if (!course) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">No recent course yet. Enroll in a course to start learning.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(160,127,97,0.95)_0%,rgba(35,41,64,1)_100%)] p-8 text-white shadow-xl shadow-slate-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
      <div className="relative z-10 max-w-[36rem]">
        <p className="inline-flex rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
          {course?.progress > 0
            ? `In Progress · ${course.progress}%`
            : "New Course"}
        </p>
        <h2 className="mt-5 max-w-[24rem] text-3xl font-semibold leading-tight">
          {course.title}
        </h2>
        <p className="mt-4 max-w-[30rem] text-sm leading-6 text-white/80">
          {course?.progress === 0
            ? "Start your learning journey with this course."
            : course?.progress < 100
              ? `You're ${course.progress}% through. Keep going!`
              : "You’ve completed this course 🎉"}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/course/${course._id}`)}
            className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-400"
          >
            Continue Learning
          </button>
          
        </div>
      </div>

      <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 xl:flex">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl backdrop-blur">
          ▶
        </div>
      </div>
    </div>
  );
}

function EnrolledCourseCard({ course, index, navigate }) {
  const artStyles = [
    "from-[#143f3b] via-[#214c47] to-[#0b2522]",
    "from-[#d7e5dd] via-[#cedfd5] to-[#b6cec1]",
    "from-[#f5f5f5] via-[#ececec] to-[#dcdcdc]",
  ];
  const progress = course.progress || 0;
  const moduleCount = course.totalLectures || 0;
  const mentor = course.instructor?.name || "Instructor";

  return (
    <article className="overflow-hidden rounded-[24px] bg-white shadow-sm">
      <div className={`relative h-44 bg-gradient-to-br ${artStyles[index % artStyles.length]} p-5`}>
        <p className="inline-flex rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
          {index === 0 ? "Design" : index === 1 ? "Development" : "3D Art"}
        </p>
        <div className="absolute inset-x-0 bottom-6 px-6 text-white">
          <p className={`text-2xl ${index === 0 ? "font-serif italic" : "font-semibold"} ${index === 2 ? "text-slate-500" : ""}`}>
            {course?.title || "Untitled Course"}
          </p>
        </div>
        {index === 2 ? (
          <div className="absolute right-8 top-11 h-24 w-24 rounded-full bg-white shadow-[inset_-10px_-18px_30px_rgba(0,0,0,0.08)]" />
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-slate-900">
          {course.title}
        </h3>
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
          <span>{moduleCount} Modules</span>
          <span>{mentor}</span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-500">
              <span>Progress</span>
              <span className="text-slate-400">{progress.toFixed ? progress.toFixed(0) : progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/course/${course._id}`)}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Open
          </button>
        </div>
      </div>
    </article>
  );
}

function StudentDashboardPage() {
  const { user } = useAuth();
  const { courses, loading, error } = useEnrolledCourses();
  const navigate = useNavigate();

  console.log(courses);

  const featuredCourse = courses.find(
    (c) => (c.progress || 0) < 100
  ) || courses[0];

  console.log(featuredCourse);
  const displayCourses = courses.slice(0, 3);

  const summary = useMemo(() => {
    const activeCourses = courses.filter(
      (c) => (c.progress || 0) < 100
    ).length;

    const learningHours = courses.length * 1.5;

    return {
      activeCourses,
      learningHours: learningHours.toFixed(1),
    };
  }, [courses]);



  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Hello,  Learner
            </h1>
            <p className="text-lg text-slate-600">
              You have <span className="font-semibold text-indigo-600">{summary.activeCourses} active courses</span> and a steady momentum this week.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Recently Watched
            </h2>
            <button type="button" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">
              View History
            </button>
          </div>

          <FeaturedCourse course={featuredCourse} navigate={navigate} />
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-slate-900">Weekly Progress</p>
                <p className="mt-4 text-sm text-slate-500">Learning Hours</p>
              </div>
              <p className="pt-1 text-sm font-semibold text-indigo-600">
                {summary.learningHours}h / 15h
              </p>
            </div>

            <div className="mt-5 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.min(100, Number(summary.learningHours) * 6)}%` }} />
            </div>

            <ProgressBars courses={courses}/>
          </div>

          <div id="mentors" className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#37309e_0%,#2c247f_60%,#4e42c6_100%)] p-6 text-white shadow-lg shadow-indigo-200">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[40px] bg-white/10" />
            <p className="text-xl font-semibold">Mentor Office Hours</p>
            <p className="mt-4 max-w-[16rem] text-sm leading-6 text-white/80">
              Join Sarah Chen for a live Q&amp;A session tomorrow at 10:00 AM.
            </p>
            <button
              type="button"
              className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700"
            >
              Set Reminder
            </button>
          </div>
        </div>
      </section>

      <section id="courses" className="rounded-[32px] bg-white px-6 py-7 shadow-sm md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            My Enrolled Courses
          </h2>
          <div className="flex items-center gap-3 text-slate-400">
            <button type="button" className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              ▦
            </button>
            <button type="button" className="rounded-2xl bg-slate-50 p-3">
              ☰
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading your courses...</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : displayCourses.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center text-sm text-slate-500">
            No enrolled courses yet.
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-3">
            {displayCourses.map((course, index) => (
              <EnrolledCourseCard
                key={course._id}
                course={course}
                index={index}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentDashboardPage;
