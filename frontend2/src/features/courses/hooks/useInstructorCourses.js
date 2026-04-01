import { useEffect, useState } from "react";
import api from "../../../services/api";

export function useInstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await api.get("/course/creator");

        if (!isMounted) return;

        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;

        setError("Failed to load instructor courses");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return { courses, loading, error };
}