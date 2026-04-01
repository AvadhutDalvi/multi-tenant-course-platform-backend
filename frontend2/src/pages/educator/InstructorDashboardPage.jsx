import { useInstructorCourses } from "../../features/courses/hooks/useInstructorCourses";

function InstructorDashboardPage() {

  const {courses,loading,error}=useInstructorCourses();
 
  if (loading) return null;
  if (error) return null;


const formattedCourses = courses.map((course) => ({
  title: course.title,
  id: course._id,
  status:
    course.status === "published"
      ? "Live"
      : course.status === "review"
      ? "Reviewing"
      : "Draft",

  students: (course.students || 0).toLocaleString(),

  revenue: `$${(course.revenue || 0).toLocaleString()}`,

  tone: "from-[#8af1eb] to-[#dffaf6]", // keep static (UI only)
}));

const totalStudents = courses.reduce(
  (sum, c) => sum + (c.students || 0),
  0
);

const totalRevenue = courses.reduce(
  (sum, c) => sum + (c.revenue || 0),
  0
);

const reviews = [
  {
    name: "Elena Vance",
    initials: "EV",
    quote:
      "The production quality of the lessons is outstanding. Alex explains complex UI principles with clarity.",
  },
  {
    name: "Marcus Thorne",
    initials: "MT",
    quote:
      "Great content, would love to see more real-world case studies in the next module.",
  },
  {
    name: "Sofia Chen",
    initials: "SC",
    quote:
      "The typography section changed the way I look at design entirely.",
  },
];

const stats = [
  {
    label: "Total Students",
    value: totalStudents.toLocaleString(),
    footnote: "+ 8.4% from last month",
    accent: "text-emerald-500",
    type: "students",
  },
  {
    label: "Revenue (USD)",
    value: `$${totalRevenue.toLocaleString()}`,
    footnote: "Strongest month this quarter",
    accent: "text-slate-400",
    type: "revenue",
  },
  {
    label: "Average Rating",
    value: "4.9",
    footnote: "Auto calculated later",
    accent: "text-amber-400",
    type: "rating",
  },
];

function StatCard({ stat }) {
  if (stat.type === "revenue") {
    return (
      <article className="rounded-[26px] bg-white p-6 shadow-sm shadow-slate-200/70">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-900">
              {stat.value}
            </p>
          </div>
          <div className="rounded-full bg-indigo-50 p-2 text-indigo-500">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M4 17 10 11l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="mt-6 flex h-14 items-end gap-1">
          {[26, 24, 38, 31, 56, 63].map((height, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t-sm ${index > 3 ? "bg-indigo-600" : "bg-indigo-200"}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </article>
    );
  }

  if (stat.type === "rating") {
    return (
      <article className="rounded-[26px] bg-white p-6 shadow-sm shadow-slate-200/70">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-900">
              {stat.value}
            </p>
          </div>
          <div className="rounded-full bg-amber-50 p-2 text-amber-400">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="m12 3.6 2.57 5.2 5.74.83-4.15 4.05.98 5.72L12 16.7l-5.14 2.7.98-5.72L3.69 9.63l5.74-.83L12 3.6Z" />
            </svg>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              className="h-4 w-4 text-amber-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="m12 3.6 2.57 5.2 5.74.83-4.15 4.05.98 5.72L12 16.7l-5.14 2.7.98-5.72L3.69 9.63l5.74-.83L12 3.6Z" />
            </svg>
          ))}
          <span className="ml-3 text-xs font-medium text-slate-400">{stat.footnote}</span>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-[26px] bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {stat.label}
          </p>
          <p className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-900">
            {stat.value}
          </p>
        </div>
        <div className="rounded-full bg-indigo-50 p-2 text-indigo-500">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M8 11a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-4 7a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 9h4M20 7v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <p className={`mt-8 text-sm font-semibold ${stat.accent}`}>{stat.footnote}</p>
    </article>
  );
}

function CourseRow({ course }) {
  const isLive = course.status === "Live";

  return (
    <div className="grid grid-cols-[minmax(0,1.8fr)_0.8fr_0.8fr_0.8fr_0.45fr] items-center gap-4 border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.tone}`}>
          <div className="h-4 w-4 rounded-sm border border-slate-400/40 bg-white/60" />
        </div>
        <p className="max-w-[14rem] font-medium leading-5 text-slate-900">{course.title}</p>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
            isLive
              ? "bg-emerald-50 text-emerald-500"
              : "bg-indigo-50 text-indigo-500"
          }`}
        >
          {course.status}
        </span>
      </div>

      <p className="font-medium text-slate-700">{course.students}</p>
      <p className="font-medium text-slate-700">{course.revenue}</p>

      <div className="flex items-center gap-3 text-slate-400">
        <button type="button" className="transition hover:text-slate-700">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="m4 20 4.5-1 9.2-9.2a1.8 1.8 0 0 0 0-2.55l-.95-.95a1.8 1.8 0 0 0-2.55 0L5 15.5 4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="transition hover:text-slate-700">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="border-t border-slate-100 px-5 py-4 first:border-t-0">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6d5c5] text-xs font-semibold text-slate-900">
          {review.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{review.name}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                Advanced UI Mastery · 2 hours ago
              </p>
            </div>
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3.6 2.57 5.2 5.74.83-4.15 4.05.98 5.72L12 16.7l-5.14 2.7.98-5.72L3.69 9.63l5.74-.83L12 3.6Z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">{review.quote}</p>
        </div>
      </div>
    </div>
  );
}



  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[2.2rem] font-semibold tracking-tight text-slate-900">
            Welcome back, Alex.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your studio performance is up 12% this week. Keep creating.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500"
        >
          <span className="text-base leading-none">+</span>
          <span>Create New Course</span>
        </button>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm shadow-slate-200/70">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Courses</h2>
            </div>
            <button type="button" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">
              View All Courses
            </button>
          </div>

          <div className="grid grid-cols-[minmax(0,1.8fr)_0.8fr_0.8fr_0.8fr_0.45fr] gap-4 border-t border-slate-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            <p>Thumbnail &amp; Title</p>
            <p>Status</p>
            <p>Students</p>
            <p>Revenue</p>
            <p>Actions</p>
          </div>

          <div>
            {formattedCourses.map((course) => (
              <CourseRow key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm shadow-slate-200/70">
          <div className="px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Reviews</h2>
            <p className="mt-1 text-sm text-slate-400">Feedback from your latest students</p>
          </div>

          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>

          <div className="px-5 pb-5 pt-3">
            <button
              type="button"
              className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Read All Reviews
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#3f37a3_0%,#342a90_60%,#2f2579_100%)] p-8 text-white shadow-xl shadow-indigo-200/60">
        <div className="max-w-3xl">
          <h2 className="text-[2rem] font-semibold tracking-tight">
            You&apos;re on track for Mastery Level 5
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
            Publish one more high-rated course this month to unlock "Studio Partner" status and receive reduced commission rates on all future sales.
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            <span>Publication Progress</span>
            <span className="text-base text-white">85%</span>
          </div>
          <div className="h-2 rounded-full bg-white/15">
            <div className="h-2 rounded-full bg-indigo-300" style={{ width: "85%" }} />
          </div>
        </div>

        <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 backdrop-blur">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Next Unlock
            </p>
            <p className="mt-1 text-sm font-medium text-white">Custom Landing Pages</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InstructorDashboardPage;
