import GlobalSearchBar from "../../components/student/GlobalSearchBar";
import { card, cardHover } from "../../styles/theme";

function StudentDashboard() {
  return (
    <div className={`${card} ${cardHover} p-6 space-y-6 max-w-5xl`}>
      <header>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Student Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Welcome back. Continue your learning.
        </p>
        <GlobalSearchBar />
      </header>
      {/* Existing dashboard sections (courses, progress, etc.) stay below */}
    </div>
  );
}

export default StudentDashboard;

