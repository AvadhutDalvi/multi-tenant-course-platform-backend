import { useParams } from "react-router-dom";
import { useCourseLearn } from "../../features/coursePlayer/hooks/useCourseLearn.js";

import LectureHeader from "../../features/coursePlayer/components/LectureHeader.jsx";
import VideoPlayer from "../../features/coursePlayer/components/VideoPlayer.jsx";
import TabsSection from "../../features/coursePlayer/components/TabsSection.jsx";
import CurriculumSidebar from "../../features/coursePlayer/components/CurriculumSidebar.jsx";

function CourseLearn() {
    const { courseId } = useParams();

    const {
        course,
        modules,
        activeLecture,
        setActiveLectureId,
        completedIds,
        progress,
        loading,
        error,
    } = useCourseLearn(courseId);

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500">Loading course...</p>
            </div>
        );
    }

    // ================= ERROR =================
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            </div>
        );
    }

    // ================= NOT FOUND =================
    if (!course) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-600">Course not found.</p>
            </div>
        );
    }

    // ================= MAIN UI =================
    return (
  <div className="h-screen flex bg-slate-50 overflow-hidden">

    {/* LEFT: CURRICULUM SIDEBAR */}
    <div className="w-80 border-r bg-white overflow-y-auto">
      <CurriculumSidebar
        modules={modules}
        activeLectureId={activeLecture?._id}
        completedIds={completedIds}
        progress={progress}
        onSelectLecture={setActiveLectureId}
      />
    </div>

    {/* RIGHT: MAIN CONTENT */}
    <div className="flex-1 flex flex-col">

      {/* SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* HEADER */}
        <LectureHeader
          lecture={activeLecture}
          module={activeLecture?.module}
          progress={progress}
          onNext={() => {
            const allLectures = Object.values(modules).flat();
            const currentIndex = allLectures.findIndex(
              (l) => l._id === activeLecture?._id
            );

            if (currentIndex !== -1 && currentIndex < allLectures.length - 1) {
              setActiveLectureId(allLectures[currentIndex + 1]._id);
            }
          }}
        />

        {/* VIDEO */}
        <VideoPlayer lecture={activeLecture} />

        {/* TABS */}
        <TabsSection lecture={activeLecture} />

      </div>
    </div>

  </div>
);
}

export default CourseLearn;