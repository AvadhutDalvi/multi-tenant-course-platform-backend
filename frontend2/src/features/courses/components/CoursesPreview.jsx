import { Link } from "react-router-dom";
import { useEnrolledCourses } from "../hooks/useEnrolledCourses.js";
import CourseCard from "./CourseCard.jsx";

function CoursesPreview() {
  const { courses, loading, error } = useEnrolledCourses();

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Enrolled courses
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Keep learning</h2>
        </div>
        <Link
          to="/dashboard/student/my-courses"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading your courses...</p>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          You have not enrolled in any courses yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CoursesPreview;
