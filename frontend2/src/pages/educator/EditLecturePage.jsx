import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import EditLectureHeader from "../../components/lecture/EditLectureHeader";
import EditLectureTabs from "../../components/lecture/EditLectureTabs";
import LectureBasicsSection from "../../components/lecture/LectureBasicsSection";
import LectureMediaSection from "../../components/lecture/LectureMediaSection";
import LectureMaterialsSection from "../../components/lecture/LectureMaterialsSection";
import LecturePracticeSection from "../../components/lecture/LecturePracticeSection";
import RightSidebarPanels from "../../components/lecture/RightSidebarPanels";
import EditLectureFooterBar from "../../components/lecture/EditLectureFooterBar";

function EditLecturePage() {

  const { lectureId } = useParams();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    order: "",

    video: null,
    thumbnail: null,

    videoPreview: "",
    thumbnailPreview: "",

    materials: [],
    practiceSheet: null,
    status: "draft",
    isPreview: false
  });

  useEffect(() => {
    async function fetchLecture() {
      try {
        const res = await api.get(`/course/lecture/${lectureId}`);
        
        const lecture = res.data.lecture;
        console.log("Backend materials:", lecture.materials);
        setFormData({
          title: lecture.title || "",
          description: lecture.description || "",
          duration: lecture.duration || "",
          order: lecture.order || "",

          // These should remain empty until the user selects a new file
          video: null,
          thumbnail: null,

          // Existing media URLs for preview
          videoPreview: lecture.video?.url || "",
          thumbnailPreview: lecture.thumbnail?.url || "",

          materials: (lecture.materials || []).map(material => ({
            _id: material._id,
            title: material.title,
            url: material.url,
            public_id: material.public_id,
            status: "existing"
          })),
         practiceSheet: lecture.practiceSheet || null,

          status: lecture.status || "draft",
          isPreview: lecture.isPreview || false,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchLecture();
  }, [lectureId]);

  if (loading) {
    return <div className="p-10 text-slate-500">Loading lecture...</div>;
  }

  return (
    <div className="min-h-full bg-[#f7f7fb] pb-2">
      <div className="mx-auto max-w-[1220px]">
        <EditLectureHeader formData={formData} />
        <EditLectureTabs />

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <main className="space-y-6">
            <LectureBasicsSection
              formData={formData}
              setFormData={setFormData} />

            <LectureMediaSection
              formData={formData}
              setFormData={setFormData} />

            <LectureMaterialsSection
              formData={formData}
              setFormData={setFormData} />

            <LecturePracticeSection
              formData={formData}
              setFormData={setFormData} />

          </main>

          <aside>
            <RightSidebarPanels
              formData={formData}
              setFormData={setFormData} />
          </aside>
        </div>

        <EditLectureFooterBar
          formData={formData}
          lectureId={lectureId} />

      </div>
    </div>
  );
}

export default EditLecturePage;
