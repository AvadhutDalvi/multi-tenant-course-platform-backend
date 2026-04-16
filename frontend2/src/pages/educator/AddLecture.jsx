import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasicInfoSection from "../../components/lecture/BasicInfoSection";
import VideoSection from "../../components/lecture/VideoSection";
import ResourcesSection from "../../components/lecture/ResourcesSection";
import api from "../../services/api";

const createMaterial = (id) => ({
  id,
  title: "",
  file: null,
  url: "",
});

function AddLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "",
    order: "",
    status: "draft",
    videoFile: null,
    videoUrl: null,
    duration: "",
    thumbnail: null,
    thumbnailUrl:null,
    materials: [createMaterial(1)],
    practiceSheet: {
      title: "",
      file: null,
      url: "",
    },
  });
  const [isDurationEditable, setIsDurationEditable] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileFieldChange = (field) => (event) => {
    const file = event.target.files?.[0] || null;
    setFormData((current) => ({
      ...current,
      [field]: file,
    }));
  };

  const handleToggleDurationEdit = () => {
    setIsDurationEditable((current) => {
      const next = !current;

      if (!next) {
        setFormData((prev) => ({
          ...prev,
          duration: "",
        }));
      }

      return next;
    });
  };

  const handleAddMaterial = () => {
    setFormData((current) => ({
      ...current,
      materials: [...current.materials, createMaterial(Date.now())],
    }));
  };

  const handleRemoveMaterial = (materialId) => {
    setFormData((current) => {
      const nextMaterials = current.materials.filter((material) => material.id !== materialId);

      return {
        ...current,
        materials: nextMaterials.length ? nextMaterials : [createMaterial(Date.now())],
      };
    });
  };

  const handleMaterialFieldChange = (materialId, field, value) => {
    setFormData((current) => ({
      ...current,
      materials: current.materials.map((material) =>
        material.id === materialId ? { ...material, [field]: value } : material,
      ),
    }));
  };

  const handleMaterialFileChange = (materialId, event) => {
    const file = event.target.files?.[0] || null;

    setFormData((current) => ({
      ...current,
      materials: current.materials.map((material) =>
        material.id === materialId ? { ...material, file } : material,
      ),
    }));
  };

  const handlePracticeSheetFieldChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      practiceSheet: {
        ...current.practiceSheet,
        [field]: value,
      },
    }));
  };

  const handlePracticeSheetFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setFormData((current) => ({
      ...current,
      practiceSheet: {
        ...current.practiceSheet,
        file,
      },
    }));
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {
      const formDataToSend = new FormData();

      // 🔹 BASIC
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("module", formData.module);
      formDataToSend.append("order", formData.order);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("course", courseId);


      // 🔥 VIDEO (FILE OR URL)
      if (formData.videoFile) {
        formDataToSend.append("video", formData.videoFile);
      } else if (formData.videoUrl) {
        formDataToSend.append("videoUrl", formData.videoUrl);
      } else {
        alert("Video file or URL is required");
        return;
      }

      // 🔹 THUMBNAIL
      // 🔹 THUMBNAIL (FILE OR URL - OPTIONAL)
      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      } else if (formData.thumbnailUrl) {
        formDataToSend.append("thumbnailUrl", formData.thumbnailUrl);
      }

      // 🔹 MATERIALS
      formData.materials.forEach((mat) => {
        if (mat.file) {
          formDataToSend.append("materials", mat.file);
        }
      });

      // 🔹 PRACTICE SHEET
      if (formData.practiceSheet.file) {
        formDataToSend.append("practiceSheet", formData.practiceSheet.file);
      }

      const res = await api.post(
        `/course/${courseId}/lecture`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);
      alert("Lecture added successfully");

    } catch (err) {
      console.error(err);
      alert("Error adding lecture");
    }

  };

  return (
    <div className="min-h-screen bg-[#fbfbfe] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="text-sm text-[#9AA3B7]">
          <span>My Courses</span>
          <span className="mx-2 text-[#C7CEDD]">&gt;</span>
          <span>Course Management</span>
          <span className="mx-2 text-[#C7CEDD]">&gt;</span>
          <span className="font-semibold text-[#5B48F2]">Add Lecture</span>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#111827] sm:text-[38px]">
              Add New Lecture
            </h1>
            <p className="mt-3 max-w-[720px] text-[16px] leading-[1.6] text-[#5F6B84]">
              Create lecture details, add video content, and attach supporting materials.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#F3F0FF] px-4 py-2 text-sm font-semibold text-[#5B48F2]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#5B48F2]" />
            Draft Lecture
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <BasicInfoSection formData={formData} onFieldChange={handleFieldChange} />

          <VideoSection
            formData={formData}
            isDurationEditable={isDurationEditable}
            onFieldChange={handleFieldChange}
            onVideoChange={handleFileFieldChange("videoFile")}
            onThumbnailChange={handleFileFieldChange("thumbnail")}
            onToggleDurationEdit={handleToggleDurationEdit}
          />

          <ResourcesSection
            materials={formData.materials}
            practiceSheet={formData.practiceSheet}
            onAddMaterial={handleAddMaterial}
            onRemoveMaterial={handleRemoveMaterial}
            onMaterialFieldChange={handleMaterialFieldChange}
            onMaterialFileChange={handleMaterialFileChange}
            onPracticeSheetFieldChange={handlePracticeSheetFieldChange}
            onPracticeSheetFileChange={handlePracticeSheetFileChange}
          />

          <div className="mt-10 flex flex-col-reverse gap-4 border-t border-[#ECEFFA] pt-8 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="rounded-full border border-[#E2E7F2] bg-white px-6 py-3 text-[15px] font-semibold text-[#4B5563] transition hover:border-[#CDD5E5] hover:shadow-[0_10px_24px_rgba(17,24,39,0.05)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#4F35F4] px-7 py-3 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(79,53,244,0.24)] transition hover:bg-[#4328EF] hover:shadow-[0_14px_30px_rgba(79,53,244,0.28)]"
            >
              Add Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLecture;
