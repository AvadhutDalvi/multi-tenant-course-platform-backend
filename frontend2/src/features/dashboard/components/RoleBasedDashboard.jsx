import { useAuth } from "../../auth/hooks/useAuth.js";
import StudentDashboardPage from "../../../pages/student/StudentDashboardPage.jsx";
import InstructorDashboardPage from "../../../pages/educator/InstructorDashboardPage.jsx";

function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "educator") {
    return <InstructorDashboardPage />;
  }

  return <StudentDashboardPage />;
}

export default RoleBasedDashboard;