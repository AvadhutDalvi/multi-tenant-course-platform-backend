import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyCourses from "./pages/student/MyCourses";
import CourseLearning from "./pages/student/CourseLearning";
import ChannelPage from "./pages/student/ChannelPage";
import EducatorMyCourses from "./pages/educator/MyCourses";
import CreateCourse from "./pages/educator/CreateCourse";
import ManageCourse from "./pages/educator/ManageCourse";
import CreateChannel from "./pages/educator/CreateChannel";
import Search from "./pages/student/Search";


import DashboardLayout from "./layouts/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import EducatorDashboard from "./pages/educator/EducatorDashboard";

function App() {
  return (
    <Routes>



      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

     
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
      >
        <Route path="educator/my-courses" element={<EducatorMyCourses />} />
        <Route path="create-channel" element={<CreateChannel />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="course/:courseId" element={<CourseLearning />} />
        <Route path="student/my-courses" element={<MyCourses />} />
        <Route index element={<StudentDashboard />} />
        <Route path="educator" element={<EducatorDashboard />} />
        <Route path="manage-course/:courseId" element={<ManageCourse />}/>
        <Route path="search" element={<Search />} />
        <Route path="channel/:slug" element={<ChannelPage />} />
      </Route>

    </Routes >
  );
}

export default App;
