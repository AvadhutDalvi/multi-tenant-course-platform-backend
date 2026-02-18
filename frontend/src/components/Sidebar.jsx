
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


function Sidebar() {
  const { user } = useContext(AuthContext);

  const role = user?.role; // get role from JWT

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
            <Link to="/dashboard/my-courses" className="block text-gray-700 hover:text-black">
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
            <Link to="/dashboard/my-courses" className="block text-gray-700 hover:text-black">
              My Courses
            </Link>
            <Link to="/dashboard/create-course" className="block text-gray-700 hover:text-black">
              Create Course
            </Link>
          </>
        )}

      </nav>
    </div>
  );
}

export default Sidebar;
