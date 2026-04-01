import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { btnSecondary } from "../styles/theme";

function Sidebar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const role = user?.role;

  // ✅ Better active check (handles nested routes)
  const isActive = (path) => pathname.startsWith(path);

  const handleCreateCourseClick = async (e) => {
    e.preventDefault();
    try {
      await api.get("/channel/me");
      navigate("/dashboard/create-course");
    } catch (err) {
      navigate("/dashboard/create-channel");
    }
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
      
      {/* 🔹 Logo / Title */}
      <h2 className="text-lg font-bold text-slate-900 mb-8 tracking-tight">
        SaaS Platform
      </h2>

      {/* 🔹 Navigation */}
      <nav className="space-y-2">

        {/* ================= STUDENT ================= */}
        {role === "student" && (
          <>
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${
                  isActive("/dashboard") &&
                  !isActive("/dashboard/student") &&
                  !isActive("/dashboard/progress")
                    ? "bg-sky-100 text-sky-700 font-semibold"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
            >
              Dashboard
            </Link>

            <Link
              to="/dashboard/student/my-courses"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${
                  isActive("/dashboard/student/my-courses")
                    ? "bg-sky-100 text-sky-700 font-semibold"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
            >
              My Courses
            </Link>

            <Link
              to="/dashboard/progress"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${
                  isActive("/dashboard/progress")
                    ? "bg-sky-100 text-sky-700 font-semibold"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
            >
              Progress
            </Link>
          </>
        )}

        {/* ================= EDUCATOR ================= */}
        {role === "educator" && (
          <>
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${
                  isActive("/dashboard") &&
                  !isActive("/dashboard/educator")
                    ? "bg-sky-100 text-sky-700 font-semibold"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
            >
              Dashboard
            </Link>

            <Link
              to="/dashboard/educator/my-courses"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${
                  isActive("/dashboard/educator/my-courses")
                    ? "bg-sky-100 text-sky-700 font-semibold"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
            >
              My Courses
            </Link>

            <button
              onClick={handleCreateCourseClick}
              className={`${btnSecondary} w-full text-left transition-all duration-200
                ${
                  isActive("/dashboard/create-course") ||
                  isActive("/dashboard/create-channel")
                    ? "bg-sky-100 text-sky-700 border-sky-200"
                    : "hover:bg-sky-50 hover:text-sky-700"
                }`}
            >
              Create Course
            </button>
          </>
        )}
      </nav>

      {/* 🔹 Optional Footer (future upgrade) */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          © 2026 SaaS Platform
        </p>
      </div>
    </div>
  );
}

export default Sidebar;