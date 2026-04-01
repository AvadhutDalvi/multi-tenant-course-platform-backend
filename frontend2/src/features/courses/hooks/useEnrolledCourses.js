import { useEffect, useState } from "react";
import api from "../../../services/api.js";
import { useAuth } from "../../auth/hooks/useAuth.js";

export function useEnrolledCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      if (user === undefined) {
        return;
      }

      if (user?.role !== "student") {
        setCourses([]);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await api.get("/course/enrolled");

        if (!isMounted) return;
        setCourses(response.data.courses || []);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to load enrolled courses.");
      } finally { 
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { courses, loading, error };
}
