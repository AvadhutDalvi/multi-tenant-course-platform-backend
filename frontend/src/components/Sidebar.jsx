
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";


function Sidebar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = user?.role; // get role from JWT

  const handleCreateCourseClick = async (e) => {
    e.preventDefault();
    try {
      await api.get("/channel/me");
      navigate("/dashboard/create-course");
    } catch (err) {
      if (err.response?.status === 404) {
        navigate("/dashboard/create-channel");
      } else {
        navigate("/dashboard/create-channel");
      }
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      
      <h2 className="text-xl font-semibold mb-8">
        SaaS Platform
      </h2>

      <nav className="space-y-4">

        {role === "student" && (
          <>
            <Link to="/dashboard" className="block text-gray-700 hover:text-black">
              Dashboard
            </Link>
            <Link to="/dashboard/student/my-courses" className="block text-gray-700 hover:text-black">
              My Courses
            </Link>
            <Link to="/dashboard/progress" className="block text-gray-700 hover:text-black">
              Progress
            </Link>
          </>
        )}

        {role === "educator" && (
          <>
            <Link to="/dashboard" className="block text-gray-700 hover:text-black">
              Dashboard
            </Link>
            <Link to="/dashboard/educator/my-courses" className="block text-gray-700 hover:text-black">
              My Courses
            </Link>
            <button
              onClick={handleCreateCourseClick}
              className="block text-left text-gray-700 hover:text-black w-full"
            >
              Create Course
            </button>
          </>
        )}

      </nav>
    </div>
  );
}

export default Sidebar;
