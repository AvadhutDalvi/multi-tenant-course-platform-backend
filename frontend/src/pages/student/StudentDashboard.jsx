import GlobalSearchBar from "../../components/student/GlobalSearchBar";

function StudentDashboard() {
  return (
    <div className="max-w-5xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back. Continue your learning.
        </p>
        <GlobalSearchBar />
      </header>
      {/* Existing dashboard sections (courses, progress, etc.) stay below */}
    </div>
  );
}

export default StudentDashboard;

