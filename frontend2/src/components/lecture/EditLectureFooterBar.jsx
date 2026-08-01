import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function EditLectureFooterBar({
  formData,
  lectureId
}) {
  const navigate = useNavigate();

  async function handleSave() {
    try {

      const existingMaterials = [];
      const newMaterials = [];
      const deletedMaterialIds = [];

      (formData.materials || []).forEach((material) => {

        if (material.status === "existing") {
          existingMaterials.push({
            _id: material._id,
            title: material.title,
          });
        }

        else if (material.status === "new") {
          newMaterials.push({
            tempId: material.tempId,
            title: material.title,
            url: material.url || "",
          });
        }

        else if (material.status === "deleted" && material._id) {
          deletedMaterialIds.push(material._id);
        }

        // New materials marked as deleted are ignored
      });

      // Uncomment while testing
      // console.log(existingMaterials);
      // console.log(newMaterials);
      // console.log(deletedMaterialIds);

      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("duration", formData.duration || "");
      formDataToSend.append("order", formData.order || "");
      formDataToSend.append("status", formData.status || "draft");
      formDataToSend.append("isPreview", formData.isPreview || false);
      formDataToSend.append("releaseDate", formData.releaseDate || "");

      // ✅ New Material Payload
      formDataToSend.append(
        "existingMaterials",
        JSON.stringify(existingMaterials)
      );

      formDataToSend.append(
        "newMaterials",
        JSON.stringify(newMaterials)
      );

      formDataToSend.append(
        "deletedMaterialIds",
        JSON.stringify(deletedMaterialIds)
      );

      // ✅ Upload material files
      (formData.materials || []).forEach((material) => {
        if (material.status === "new" && material.file) {
          formDataToSend.append(
            "materials",
            material.file
          );
        }
      });

      // Existing Practice Flow (unchanged)
      if (formData.practiceSheet?.file) {
        formDataToSend.append(
          "practiceSheet",
          formData.practiceSheet.file
        );
      }

      // Existing Video Flow (unchanged)
      if (formData.video) {
        formDataToSend.append(
          "video",
          formData.video
        );
      }

      // Existing Thumbnail Flow (unchanged)
      if (formData.thumbnail) {
        formDataToSend.append(
          "thumbnail",
          formData.thumbnail
        );
      }

      await api.put(
        `/course/lecture-update/${lectureId}`,
        formDataToSend
      );

      alert("Lecture updated successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to update lecture");
    }
  }
  
  async function handlePublish() {
    try {

        await api.patch(
            `/course/lecture/${lectureId}/publish`
        );

        alert("Lecture published");

    } catch (error) {

        console.error(error);
        alert("Publish failed");

    }
}

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="sticky bottom-4 z-30 mt-8 rounded-[28px] border border-white/80 bg-white/95 px-5 py-4 shadow-[0_20px_55px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Side */}
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Changes ready to save
          </p>

          <p className="mt-1 text-sm font-medium text-slate-400">
            Update lecture content anytime
          </p>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-full border border-indigo-100 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 hover:shadow-indigo-300"
          >
            Publish Update
          </button>

        </div>
      </div>
    </div>
  );
}

export default EditLectureFooterBar;