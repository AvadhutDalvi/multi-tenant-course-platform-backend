import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/50">
      <div className="mb-5 flex h-40 items-end rounded-[1.25rem] bg-gradient-to-br from-sky-100 via-white to-indigo-100 p-4">
        <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
          Enrolled
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{course.title}</h2>
          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
            {course.description || "Continue from where you left off in this course."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm font-medium text-slate-500">
            {course.price ? `₹${course.price}` : "Included"}
          </p>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/course/${course._id}`)}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Continue
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
