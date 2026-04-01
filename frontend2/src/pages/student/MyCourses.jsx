import { useEnrolledCourses } from "../../features/courses/hooks/useEnrolledCourses.js";
import CourseCard from "../../features/courses/components/CourseCard.jsx";

function StudentMyCoursesPage() {
  const { courses, loading, error } = useEnrolledCourses();

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          Student courses
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">My Courses</h1>
        <p className="mt-2 text-sm text-slate-500">
          Continue watching your enrolled courses and jump back into lectures quickly.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading your courses...</p>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          No enrolled courses yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}

export default StudentMyCoursesPage;
