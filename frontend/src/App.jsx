import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";


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
      <Route index element={<StudentDashboard />} />
      <Route path="educator" element={<EducatorDashboard />} />
    </Route>

    </Routes >
  );
}

export default App;
