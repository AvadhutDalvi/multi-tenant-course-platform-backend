import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function EducatorMyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/course/creator"); 
        setCourses(response.data.courses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>

        <button
          onClick={() => navigate("/dashboard/create-course")}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          Create Course
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses created yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <h2 className="text-xl font-semibold mb-2">
                {course.title}
              </h2>

              <p className="text-gray-600 mb-4">
                {course.description}
              </p>

              <button
                onClick={() =>
                  navigate(`/dashboard/manage-course/${course._id}`)
                }
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EducatorMyCourses;