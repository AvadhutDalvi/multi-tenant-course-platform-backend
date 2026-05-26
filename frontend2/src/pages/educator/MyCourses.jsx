import { useInstructorCourses } from "../../features/courses/hooks/useInstructorCourses";
import { useNavigate } from "react-router-dom";


const imageTones = [
  "from-[#10151f] via-[#1b222f] to-[#151b26]",
  "from-[#17151c] via-[#211e29] to-[#161419]",
  "from-[#0f4442] via-[#174c49] to-[#143937]",
  "from-[#07131d] via-[#10283d] to-[#0d1520]",
];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function formatCurrency(value) {
  return `$ ${formatNumber(value)}`;
}

function SummaryIcon({ type }) {
  if (type === "students") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
        <path d="M8 11a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-4 7a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 9h4M20 7v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "revenue") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MetaIcon({ type }) {
  if (type === "students") {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 18a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 8.5a2.5 2.5 0 1 1 0 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "revenue") {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 10h16" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "rating") {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="m12 3.7 2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 15.96l-4.8 2.5.92-5.34-3.88-3.78 5.36-.78L12 3.7Z" />
      </svg>
    );
  }

  if (type === "review") {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
        <path d="M7 7h10M7 11h7m-7 4h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SummaryCard({ card }) {
  return (
    <article className="rounded-[26px] bg-white px-7 py-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {card.label}
          </p>
          <p className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-900">
            {card.value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
          <SummaryIcon type={card.icon} />
        </div>
      </div>
    </article>
  );
}

function CourseCard({ course }) {

 
  const navigate=useNavigate();
  return (
    <article className="grid gap-5 rounded-[30px] bg-white p-5 shadow-sm shadow-slate-200/70 md:grid-cols-[130px_minmax(0,1fr)_110px] md:items-center">
      <div className={`relative h-[92px] overflow-hidden rounded-xl bg-gradient-to-br ${course.imageTone}`}>
        <span
          className={`absolute left-3 top-3 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
            course.badge === "Live"
              ? "bg-white text-indigo-600"
              : course.badge === "Draft"
                ? "bg-white text-slate-500"
                : "bg-fuchsia-500 text-white"
          }`}
        >
          {course.badge}
        </span>
        <div className="absolute inset-x-3 bottom-3 h-[1px] bg-white/50" />
        <div className="absolute left-3 top-10 space-y-1 text-[4px] uppercase tracking-[0.2em] text-white/70">
          <div className="h-1 w-10 rounded-full bg-white/70" />
          <div className="h-1 w-6 rounded-full bg-white/40" />
          <div className="h-1 w-12 rounded-full bg-white/30" />
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-slate-900">
          {course.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
          {course.meta.map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <span className={item.icon === "review" ? "text-fuchsia-500" : "text-slate-400"}>
                <MetaIcon type={item.icon} />
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:items-end">
        <button
          type="button"
          onClick={() => navigate(`/dashboard/educator/manage-course/${course.id}`)}
          className={`inline-flex min-w-[92px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${course.primaryTone}`}
        >
          Manage
        </button>
        <button
          type="button"
          className={`inline-flex min-w-[92px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${course.secondaryTone}`}
        >
          {course.secondaryAction}
        </button>
      </div>
    </article>
  );
}

function ActionChip({ label, icon }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/70 transition hover:bg-slate-50"
    >
      <span className="text-slate-400">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function InstructorMyCoursesPage() {
  const {
    courses,
    loading,
    error,
  } = useInstructorCourses();



  const formattedCourses = courses.map((course, index) => {
    const students = Number(course.students) || 0;
    const revenue = Number(course.revenue ?? course.price ?? 0) || 0;
    const rating = Number(course.rating ?? 4.8);
    const status = (course.status || "live").toLowerCase();

    const badge =
      status === "draft"
        ? "Draft"
        : status === "review" || status === "under review" || status === "pending"
          ? "Under Review"
          : "Live";

    const isDraft = badge === "Draft";
    const isReview = badge === "Under Review";

    return {
      id: course._id || index,
      badge,
      title: course.title || "Untitled Course",
      description:
        course.description || "No description available for this course yet.",
      imageTone: imageTones[index % imageTones.length],
      meta: isDraft
        ? [
            { icon: "progress", text: "In Progress 80% Done" },
            { icon: "calendar", text: "Updated 2 days ago" },
          ]
        : [
            { icon: "students", text: `${formatNumber(students)} Students` },
            { icon: "revenue", text: `${formatCurrency(revenue)} Revenue` },
            isReview
              ? { icon: "review", text: "Pending Review" }
              : { icon: "rating", text: `${rating.toFixed(1)} Rating` },
          ],
      primaryAction: isDraft ? "Resume" : isReview ? "Edit Draft" : "Edit Course",
      secondaryAction: isDraft ? "Discard" : "Analytics",
      primaryTone: isReview
        ? "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
        : "bg-indigo-600 text-white hover:bg-indigo-500",
      secondaryTone: isReview
        ? "bg-slate-50 text-slate-300"
        : "bg-slate-50 text-slate-600 hover:bg-slate-100",
    };
  });


  const totalStudents = courses.reduce(
    (sum, course) => sum + (Number(course.students) || 0),
    0,
  );
  const totalRevenue = courses.reduce(
    (sum, course) => sum + (Number(course.revenue ?? course.price ?? 0) || 0),
    0,
  );

  const summaryCards = [
    {
      label: "Total Courses",
      value: formatNumber(courses.length),
      icon: "courses",
    },
    {
      label: "Active Students",
      value: formatNumber(totalStudents),
      icon: "students",
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(totalRevenue),
      icon: "revenue",
    },
  ];

  if (loading) {
    return <p className="text-sm text-slate-500">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-7">
      <section className="grid gap-5 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} card={card} />
        ))}
      </section>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Course Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and optimize your digital workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ActionChip label="Filter" icon="⌁" />
          <ActionChip label="Sort" icon="⇅" />
        </div>
      </section>

      <section className="space-y-4">
        {formattedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>

      <div className="flex justify-center pt-8">
        <button
          type="button"
          className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-indigo-600 shadow-sm shadow-slate-200/80 transition hover:bg-slate-50"
        >
          Show More Courses
        </button>
      </div>
    </div>
  );
}

export default InstructorMyCoursesPage;
