import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import StudentSidebar from "../../../pages/student/StudentSidebar";
import InstructorSidebar from "../../../pages/educator/InstructorSidebar.jsx";
import DashboardTopbar from "../components/DashboardTopbar.jsx";
import DashboardFooter from "../components/DashboardFooter.jsx";

function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#efeff3] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {user?.role === "educator"? <InstructorSidebar />: <StudentSidebar />}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <DashboardTopbar />
          <main className="min-w-0 flex-1 px-5 py-6 md:px-8 xl:px-10">
            <Outlet />
          </main>
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
