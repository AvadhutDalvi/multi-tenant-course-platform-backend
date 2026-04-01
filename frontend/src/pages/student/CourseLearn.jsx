import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "./course/Sidebar";
import VideoSection from "./course/VideoSection";
import ActionBar from "./course/ActionBar";
import MaterialsSection from "./course/MaterialsSection";
import PracticeSection from "./course/PracticeSection";
import NotesSection from "./course/NotesSection";
import { card } from "../../styles/theme";

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

  const activeLecture =
    lectures.find((l) => l._id === activeLectureId) || null;

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

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading course...</p>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Course not found.</p>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* LEFT SIDEBAR */}
      <Sidebar
        course={course}
        modules={modules}
        activeLectureId={activeLectureId}
        completedIds={completedIds}
        progress={progress}
        onSelectLecture={handleSelectLecture}
      />

      {/* RIGHT CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">
            {activeLecture?.title}
          </h1>

          <span className="text-sm font-semibold text-sky-600">
            {progress}% completed
          </span>
        </div>

        {/* VIDEO */}
        <div className={`${card} overflow-hidden`}>
          <VideoSection lecture={activeLecture} />
        </div>

        {/* ACTION BAR */}
        <div className={`${card} p-4`}>
          <ActionBar
            course={course}
            lecture={activeLecture}
            progress={progress}
            onMarkComplete={handleMarkComplete}
            isCompleted={
              !!activeLecture &&
              completedIds.includes(activeLecture._id)
            }
          />
        </div>

        {/* MATERIALS */}
        <div className={`${card} p-4`}>
          <MaterialsSection
            materials={activeLecture?.materials || []}
          />
        </div>

        {/* PRACTICE */}
        <div className={`${card} p-4`}>
          <PracticeSection
            practiceSheet={activeLecture?.practiceSheet}
          />
        </div>

        {/* NOTES */}
        <div className={`${card} p-4`}>
          <NotesSection />
        </div>

      </main>
    </div>
  );
}

export default CourseLearn;