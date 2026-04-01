import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

export function useCourseLearn(courseId) {
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [progress, setProgress] = useState(0);

  const [activeLectureId, setActiveLectureId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH DATA =================
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
        } = res.data || {};

        setCourse(course || null);
        setLectures(lectures || []);
        setCompletedIds(progress?.completedLectures || []);
        setProgress(progress?.percentage || 0);
        setActiveLectureId(currentLecture?._id || null);

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  // ================= GROUP MODULES =================
  const modules = useMemo(() => {
    const groups = {};
    lectures.forEach((lec) => {
      const key = lec.module || "Module";
      if (!groups[key]) groups[key] = [];
      groups[key].push(lec);
    });
    return groups;
  }, [lectures]);

  // ================= ACTIVE LECTURE =================
  const activeLecture =
    lectures.find((l) => l._id === activeLectureId) || null;

  // ================= MARK COMPLETE =================
  const handleMarkComplete = async () => {
    if (!activeLecture || completedIds.includes(activeLecture._id)) return;

    try {
      await api.post(
        `/course/${courseId}/lecture/${activeLecture._id}/complete`
      );

      setCompletedIds((prev) => {
        if (prev.includes(activeLecture._id)) return prev;

        const updated = [...prev, activeLecture._id];

        const total = lectures.length;

        const pct =
          total > 0
            ? Math.round((updated.length / total) * 100)
            : 0;

        setProgress(pct);
        return updated;
      });

    } catch (err) {
      console.error(err);
    }
  };

  return {
    course,
    modules,
    activeLecture,
    setActiveLectureId,
    completedIds,
    progress,
    handleMarkComplete,
    loading,
    error,
  };
}