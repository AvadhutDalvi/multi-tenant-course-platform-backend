import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "./course/Sidebar";
import VideoSection from "./course/VideoSection";
import ActionBar from "./course/ActionBar";
import MaterialsSection from "./course/MaterialsSection";
import PracticeSection from "./course/PracticeSection";
import NotesSection from "./course/NotesSection";

function CourseLearn() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalLectures, setTotalLectures] = useState(0);

  const [activeLectureId, setActiveLectureId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/course/${courseId}/learn`);
        const {
          course,
          lectures,
          progress,
          currentLecture,
          stats
        } = res.data || {};

        setCourse(course || null);
        setLectures(lectures || []);
        setCompletedIds(progress?.completedLectures || []);
        setProgress(progress?.percentage || 0);
        setTotalLectures(stats?.totalLectures || (lectures || []).length || 0);
        setActiveLectureId(currentLecture?._id || null);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/dashboard");
          return;
        }
        console.error(err);
        setError(err.response?.data?.message || "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  const modules = useMemo(() => {
    const groups = {};
    lectures.forEach((lec) => {
      const key = lec.module || "Module";
      if (!groups[key]) groups[key] = [];
      groups[key].push(lec);
    });
    return groups;
  }, [lectures]);

  const activeLecture = lectures.find((l) => l._id === activeLectureId) || null;

  const handleSelectLecture = (lectureId) => {
    setActiveLectureId(lectureId);
  };

  const handleMarkComplete = async () => {
    if (!activeLecture || completedIds.includes(activeLecture._id)) return;

    try {
      await api.post(
        `/course/${courseId}/lecture/${activeLecture._id}/complete`
      );

      setCompletedIds((prev) => {
        if (prev.includes(activeLecture._id)) return prev;
        const updated = [...prev, activeLecture._id];
        const newTotal = totalLectures || lectures.length || 0;
        const pct =
          newTotal > 0
            ? Math.round((updated.length / newTotal) * 100)
            : 0;
        setProgress(pct);
        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-6 flex items-center justify-center">
        <p className="text-gray-600">Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto py-6 flex items-center justify-center">
        <p className="text-gray-700">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 flex gap-6">
      <Sidebar
        course={course}
        modules={modules}
        activeLectureId={activeLectureId}
        completedIds={completedIds}
        progress={progress}
        onSelectLecture={handleSelectLecture}
      />

      <main className="flex-1 space-y-6">
        <VideoSection lecture={activeLecture} />
        <ActionBar
          course={course}
          lecture={activeLecture}
          progress={progress}
          onMarkComplete={handleMarkComplete}
          isCompleted={
            !!activeLecture && completedIds.includes(activeLecture._id)
          }
        />
        <MaterialsSection materials={activeLecture?.materials || []} />
        <PracticeSection practiceSheet={activeLecture?.practiceSheet} />
        <NotesSection />
      </main>
    </div>
  );
}

export default CourseLearn;

