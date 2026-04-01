import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { btnPrimary, card, cardHover } from "../../styles/theme";




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
        <div className={`${card} ${cardHover} p-6 space-y-6`}>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">
                My Courses
            </h1>

            {courses.length === 0 ? (
                <p className="text-xs text-slate-400">No enrolled courses yet.</p>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className={`${card} ${cardHover} p-6`}
                        >
                            <h2 className="text-lg font-semibold text-slate-800 mb-2">
                                {course.title}
                            </h2>

                            <p className="text-sm text-slate-600 mb-4">
                                {course.description}
                            </p>

                            <button
                                onClick={() => navigate(`/dashboard/course/${course._id}`)}
                                className={btnPrimary}
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
