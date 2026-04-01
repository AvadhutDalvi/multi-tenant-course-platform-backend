import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { btnPrimary, card, cardHover, inputStyle } from "../../styles/theme";

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
    <div className="p-7 max-w-5xl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage all your created courses
          </p>
        </div>
  
        <button
          onClick={() => navigate("/dashboard/create-course")}
          className={btnPrimary}
        >
          Create Course
        </button>
      </div>
  
      {courses.length === 0 ? (
        <div className={`${card} p-6 text-center`}>
          <p className="text-slate-500 text-sm">
            No courses created yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`${card} ${cardHover} p-5`}
            >
              <h2 className="text-sm font-semibold text-slate-800">
                {course.title}
              </h2>
  
              <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                {course.description}
              </p>
  
              <button
                onClick={() =>
                  navigate(`/dashboard/manage-course/${course._id}`)
                }
                className={`${btnPrimary} w-full mt-4`}
              >
                Manage Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default EducatorMyCourses;