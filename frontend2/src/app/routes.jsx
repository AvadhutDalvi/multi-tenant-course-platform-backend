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
import CreateCourse from "../pages/educator/CreateCourse.jsx";
import CreateChannel from "../pages/educator/CreateChannel.jsx";
import ManageCourse from "../pages/educator/ManageCourse.jsx";
import AddLecture from "../pages/educator/AddLecture.jsx";
import EditLecturePage from "../pages/educator/EditLecturePage.jsx"

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
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="educator/manage-course/:courseId" element={<ManageCourse />} />
        <Route path="create-channel" element={<CreateChannel />} />
        <Route path="course/:courseId" element={<CourseLearn />} />

        <Route path="educator/add-lecture/:courseId" element={<AddLecture />}/>
        <Route path="educator/edit-lecture/:lectureId" element={<EditLecturePage />}/>
        <Route path="search" element={<SearchChannelsPage />} />
        <Route path="channel/:slug" element={<ChannelPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
