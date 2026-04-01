import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import DashboardLayout from "../features/dashboard/layouts/DashboardLayout.jsx";
import RoleBasedDashboard from "../features/dashboard/components/RoleBasedDashboard.jsx";
import ChannelPage from "../features/courses/pages/ChannelPage.jsx";
import StudentMyCoursesPage from "../pages/student/MyCourses.jsx";
import InstructorMyCoursesPage from "../pages/educator/MyCourses.jsx";
import SearchChannelsPage from "../features/courses/pages/SearchChannelsPage.jsx";
import CourseLearn from "../pages/student/CourseLearn.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleBasedDashboard />} />
        <Route path="student/my-courses" element={<StudentMyCoursesPage />} />
        <Route path="instructor/courses" element={<InstructorMyCoursesPage />} />
        <Route path="course/:courseId" element={<CourseLearn />} />
        <Route path="search" element={<SearchChannelsPage />} />
        <Route path="channel/:slug" element={<ChannelPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
