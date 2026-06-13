import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEnrolledCourses } from "../../features/courses/hooks/useEnrolledCourses.js";

const FILTERS = ["All", "In Progress", "Completed", "Recently Accessed"];

const chartBars = [
  { day: "MON", height: "38%", className: "bg-violet-200" },
  { day: "TUE", height: "62%", className: "bg-violet-200" },
  { day: "WED", height: "28%", className: "bg-violet-200" },
  { day: "THU", height: "86%", className: "bg-indigo-700" },
  { day: "FRI", height: "48%", className: "bg-violet-200" },
  { day: "SAT", height: "66%", className: "bg-violet-200" },
  { day: "SUN", height: "96%", className: "bg-violet-600" },
];

function clampProgress(value) {
  const progress = Number(value) || 0;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

function getInstructorName(course) {
  return (
    course.instructor?.name ||
    course.educator?.name ||
    course.channel?.educator?.name ||
    course.channel?.name ||
    "Course educator"
  );
}

function getCategory(course, index) {
  return (
    course.category ||
    course.channel?.category ||
    course.level ||
    (index % 2 === 0 ? "Design" : "Development")
  );
}

function getLectureTotal(course) {
  return Number(course.totalLectures || course.lectureCount || course.lectures?.length || 0);
}

function getCompletedLectures(course, progress, totalLectures) {
  const completed = Number(course.completedLectures || course.completedLectureCount || 0);

  if (completed > 0) {
    return Math.min(completed, totalLectures || completed);
  }

  if (!totalLectures) {
    return 0;
  }

  return Math.round((progress / 100) * totalLectures);
}

function getLastWatched(course, progress) {
  if (course.lastWatched) return course.lastWatched;
  if (course.lastAccessedAt) return "Recently accessed";
  if (course.updatedAt) return "Updated recently";
  if (progress > 0) return "Resume where you left off";
  return "Ready to begin";
}

function StatCard({ value, label }) {
  return (
    <div className="flex min-h-20 flex-1 flex-col items-center justify-center border-slate-100 px-4 first:border-0 sm:border-l">
      <p className="text-3xl font-semibold leading-none text-indigo-700">{value}</p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M4 7h10m4 0h2M4 17h2m4 0h10M8 5v4m8 6v4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M5 7h14M5 12h9M5 17h5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CourseBanner({ course, index }) {
  if (course.image) {
    return (
      <img
        src={course.image}
        alt={course.title || "Course thumbnail"}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }

  const shortTitle = (course.title || "Course").slice(0, 5);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-slate-200" />
      {index % 2 === 1 ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800" />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.72),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(124,58,237,0.2),transparent_24%)]" />
      <p
        className={`absolute bottom-6 left-7 right-7 text-6xl font-semibold uppercase leading-none ${
          index % 2 === 1 ? "text-white/90" : "text-slate-400/70"
        }`}
      >
        {shortTitle}
      </p>
      <div className="absolute right-6 top-7 h-14 w-24 rounded-2xl border border-white/70 bg-white/50 shadow-sm backdrop-blur" />
    </div>
  );
}

function Toolbar({
  activeFilter,
  onFilterChange,
  query,
  onQueryChange,
  searchOpen,
  onToggleSearch,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid rounded-2xl bg-white p-2 shadow-sm shadow-slate-200/70 sm:inline-grid sm:grid-cols-4">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => onFilterChange(filter)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition lg:px-6 ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleSearch}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-200/70 transition hover:bg-slate-50"
          >
            <SlidersIcon />
            Filter By
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("Recently Accessed")}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-200/70 transition hover:bg-slate-50"
          >
            <SortIcon />
            Newest
          </button>
        </div>
      </div>

      {searchOpen ? (
        <label className="relative flex h-14 max-w-xl items-center">
          <span className="pointer-events-none absolute left-4 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by title, description, or instructor"
            className="h-full w-full rounded-2xl border border-slate-100 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/70 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      ) : null}
    </div>
  );
}

function CourseCard({ course, index, onContinue }) {
  const progress = clampProgress(course.progress);
  const totalLectures = getLectureTotal(course);
  const completedLectures = getCompletedLectures(course, progress, totalLectures);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 shrink-0 overflow-hidden bg-slate-100 lg:h-48">
        <CourseBanner course={course} index={index} />
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700 shadow-sm backdrop-blur">
          {getCategory(course, index)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight text-slate-900">
          {course.title || "Untitled Course"}
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          By {getInstructorName(course)}
        </p>
        <p className="mt-3 line-clamp-2 min-h-[2.75rem] text-sm leading-6 text-slate-500">
          {course.description || "Continue your learning journey and pick up from your latest lecture."}
        </p>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold">
            <span className="text-indigo-700">{progress}% Complete</span>
            <span className="text-slate-500">
              {totalLectures ? `${completedLectures}/${totalLectures}` : "0"} lectures
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-violet-100">
            <div
              className="h-full rounded-full bg-indigo-700 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div className="min-w-0 text-xs font-semibold italic leading-5 text-slate-400">
            <p>Last watched</p>
            <p className="line-clamp-2">{getLastWatched(course, progress)}</p>
          </div>
          <button
            type="button"
            onClick={() => onContinue(course._id)}
            className="shrink-0 rounded-2xl bg-indigo-700 px-5 py-3 text-sm font-semibold leading-tight text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </article>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="h-44 animate-pulse bg-slate-100 lg:h-48" />
          <div className="space-y-4 p-6">
            <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
            <div className="h-2 w-full animate-pulse rounded-full bg-violet-100" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function WeeklyChart() {
  return (
    <div className="mt-8">
      <div className="flex h-44 items-end gap-3 sm:gap-5">
        {chartBars.map((bar) => (
          <div key={bar.day} className="flex h-full flex-1 flex-col justify-end gap-4">
            <div className="flex h-full items-end">
              <div
                className={`w-full rounded-t-xl ${bar.className}`}
                style={{ height: bar.height }}
              />
            </div>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {bar.day}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-violet-600">
      <path
        d="M12 3.5 14.5 8l5 .9-3.5 3.7.7 5.1L12 15.5l-4.7 2.2.7-5.1L4.5 8.9l5-.9L12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MilestoneCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm shadow-slate-200/80">
      <div className="flex items-center gap-3">
        <MilestoneIcon />
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">Next Milestone</h3>
      </div>

      <div className="mx-auto mt-9 flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#4338ca_0deg,#4338ca_270deg,#e5e7eb_270deg,#e5e7eb_360deg)] p-3">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
          <p className="text-3xl font-semibold text-slate-900">75%</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Progress
          </p>
        </div>
      </div>

      <p className="mx-auto mt-7 max-w-[13rem] text-center text-base font-semibold leading-tight text-slate-900">
        Mastery of Design Fundamentals
      </p>
    </div>
  );
}

function AnalyticsSection() {
  return (
    <section className="grid gap-6 rounded-3xl border border-white/80 bg-slate-100/80 p-6 shadow-sm shadow-slate-200/70 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem] xl:p-8">
      <div className="min-w-0 py-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Weekly Learning Velocity
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700">
          You've spent 8.4 hours learning this week. That's 20% more than your average.
          Keep up the momentum to earn your 'Consistent Learner' badge!
        </p>
        <WeeklyChart />
      </div>

      <MilestoneCard />
    </section>
  );
}

function StudentMyCoursesPage() {
  const { courses, loading, error } = useEnrolledCourses();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);

  const stats = useMemo(() => {
    const completed = courses.filter((course) => clampProgress(course.progress) >= 100).length;
    const inProgress = courses.filter((course) => {
      const progress = clampProgress(course.progress);
      return progress > 0 && progress < 100;
    }).length;

    return {
      enrolled: courses.length,
      inProgress,
      completed,
    };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courses
      .filter((course) => {
        const progress = clampProgress(course.progress);

        if (activeFilter === "In Progress" && !(progress > 0 && progress < 100)) return false;
        if (activeFilter === "Completed" && progress < 100) return false;

        if (!normalizedQuery) return true;

        const searchable = [
          course.title,
          course.description,
          getInstructorName(course),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
      .sort((first, second) => {
        if (activeFilter !== "Recently Accessed") return 0;

        const firstDate = new Date(first.lastAccessedAt || first.updatedAt || first.createdAt || 0).getTime();
        const secondDate = new Date(second.lastAccessedAt || second.updatedAt || second.createdAt || 0).getTime();

        return secondDate - firstDate;
      });
  }, [activeFilter, courses, query]);

  const handleContinue = (courseId) => {
    navigate(`/dashboard/course/${courseId}`);
  };

  return (
    <section className="min-h-full bg-slate-50 px-4 py-8 sm:px-6 xl:px-8">
      <div className="mx-auto w-full max-w-[87rem] space-y-9">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">My Courses</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Track your learning journey and continue where you left off.
            </p>
          </div>

          <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-sm shadow-slate-200/80 sm:grid-cols-3 xl:w-[33.5rem]">
            <StatCard value={stats.enrolled} label="Enrolled" />
            <StatCard value={stats.inProgress} label="In Progress" />
            <StatCard value={stats.completed} label="Completed" />
          </div>
        </div>

        <Toolbar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          query={query}
          onQueryChange={setQuery}
          searchOpen={searchOpen}
          onToggleSearch={() => setSearchOpen((value) => !value)}
        />

        {loading ? (
          <LoadingGrid />
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-5 text-sm font-semibold text-red-700 shadow-sm">
            {error}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-indigo-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-2xl font-semibold text-indigo-600">
              +
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
              No courses found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Explore the course catalog, enroll in a class, and your learning dashboard will fill up here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/search")}
              className="mt-7 rounded-2xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                index={index}
                onContinue={handleContinue}
              />
            ))}
          </div>
        )}

        <AnalyticsSection />
      </div>
    </section>
  );
}

export default StudentMyCoursesPage;
