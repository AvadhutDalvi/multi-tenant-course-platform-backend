import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function CourseLearning() {
  const { courseId } = useParams();

  const [lectures, setLectures] = useState([]);
  const [progress, setProgress] = useState(0);
  const [completedLectures, setCompletedLectures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lecturesRes = await api.get(`/course/${courseId}/lectures`);
        setLectures(lecturesRes.data.lectures);

        const progressRes = await api.get(`/course/${courseId}/progress`);
        setProgress(progressRes.data.percentage);
        setCompletedLectures(progressRes.data.completedLectures || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [courseId]);

  const markComplete = async (lectureId) => {
    try {
      await api.post(
        `/course/${courseId}/lecture/${lectureId}/complete`
      );

      // Refresh progress after marking complete
      const progressRes = await api.get(`/course/${courseId}/progress`);
      setProgress(progressRes.data.percentage);
      setCompletedLectures(progressRes.data.completedLectures || []);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Course Learning
      </h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-black h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-gray-600">
          {Math.round(progress)}% Completed
        </p>
      </div>

      {/* Lecture List */}
      <div className="space-y-4">
        {lectures.map((lecture) => (
          <div
            key={lecture._id}
            className="bg-white p-5 rounded-xl border flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">
                {lecture.title}
              </h2>
            </div>

            <button
              onClick={() => markComplete(lecture._id)}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Mark Complete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseLearning;
