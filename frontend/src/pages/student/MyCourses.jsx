import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";




function MyCourses() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get("/course/enrolled");
                setCourses(response.data.courses);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                My Courses
            </h1>

            {courses.length === 0 ? (
                <p className="text-gray-500">No enrolled courses yet.</p>
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
                                onClick={() => navigate(`/dashboard/course/${course._id}`)}
                                className="bg-black text-white px-4 py-2 rounded-lg"
                            >
                                Continue Learning
                            </button>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyCourses;
