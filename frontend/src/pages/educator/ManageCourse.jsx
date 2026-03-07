import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const SPACING = "space-y-6";

function SkeletonLine({ className = "" }) {
  return (
    <div
      className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}
      aria-hidden
    />
  );
}

function ManageCourse() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [addFormKey, setAddFormKey] = useState(0);

  const [editingLectureId, setEditingLectureId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [savingLectureId, setSavingLectureId] = useState(null);

  const [deleteConfirmLecture, setDeleteConfirmLecture] = useState(null);
  const [deletingLectureId, setDeletingLectureId] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/course/${courseId}`);
      setCourse(res.data.course);
      setLectures(res.data.course?.lectures || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  const clearAddForm = () => {
    setTitle("");
    setDescription("");
    setModuleName("");
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("description", description.trim());
      formData.append("module", moduleName.trim() || "Default");
      formData.append("video", videoFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      await api.post(`/course/${courseId}/lecture/upload`, formData);
      clearAddForm();
      setAddFormKey((k) => k + 1);
      setSuccessMessage("Lecture uploaded successfully.");
      await fetchCourse();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to upload lecture.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (lec) => {
    setEditingLectureId(lec._id);
    setEditTitle(lec.title);
    setEditVideoUrl(lec.videoUrl || "");
  };

  const cancelEdit = () => {
    setEditingLectureId(null);
    setEditTitle("");
    setEditVideoUrl("");
  };

  const handleUpdateLecture = async (e) => {
    e.preventDefault();
    if (!editingLectureId) return;
    const t = editTitle.trim();
    const v = editVideoUrl.trim();
    if (!t) return;

    try {
      setSavingLectureId(editingLectureId);
      setError(null);
      const res = await api.put(
        `/course/${courseId}/lecture/${editingLectureId}`,
        { title: t, videoUrl: v }
      );
      setLectures(res.data.lectures ?? []);
      setEditingLectureId(null);
      setEditTitle("");
      setEditVideoUrl("");
      await fetchCourse();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update lecture.");
    } finally {
      setSavingLectureId(null);
    }
  };

  const confirmDelete = (lec) => setDeleteConfirmLecture(lec);
  const cancelDelete = () => {
    setDeleteConfirmLecture(null);
    setDeletingLectureId(null);
  };

  const handleDeleteLecture = async () => {
    if (!deleteConfirmLecture) return;
    const { _id } = deleteConfirmLecture;

    try {
      setDeletingLectureId(_id);
      setError(null);
      const res = await api.delete(`/course/${courseId}/lecture/${_id}`);
      setLectures(res.data.lectures ?? []);
      setDeleteConfirmLecture(null);
      await fetchCourse();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete lecture.");
    } finally {
      setDeletingLectureId(null);
    }
  };

  if (loading) {
    return (
      <div className={`max-w-3xl ${SPACING}`}>
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
          <SkeletonLine className="w-3/4" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-1/4" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <SkeletonLine className="w-24 h-5" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-full" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <SkeletonLine className="w-32 h-5" />
          <SkeletonLine className="w-full h-10" />
          <SkeletonLine className="w-full h-10" />
          <SkeletonLine className="w-28 h-10" />
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="max-w-3xl">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl text-gray-600">Course not found.</div>
    );
  }

  return (
    <div className={`max-w-3xl ${SPACING}`}>
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
        Manage Course
      </h1>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          role="status"
        >
          {successMessage}
        </div>
      )}

      {/* Course overview */}
      <section
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        aria-label="Course overview"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          {course.title}
        </h2>
        {course.description && (
          <p className="text-gray-500 text-sm mb-2">{course.description}</p>
        )}
        <p className="text-gray-400 text-sm">
          Price: {course.price != null ? `₹${course.price}` : "—"}
        </p>
      </section>

      {/* Lecture list */}
      <section
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        aria-label="Lectures"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Lectures</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {lectures.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              No lectures added yet.
            </div>
          ) : (
            lectures.map((lec, index) => (
              <div
                key={lec._id}
                className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50/80 transition-colors group"
              >
                {editingLectureId === lec._id ? (
                  <form
                    onSubmit={handleUpdateLecture}
                    className="flex-1 flex flex-wrap items-end gap-3 py-2"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Lecture title"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                        required
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="url"
                        value={editVideoUrl}
                        onChange={(e) => setEditVideoUrl(e.target.value)}
                        placeholder="Video URL"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={savingLectureId === lec._id}
                        className="px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {savingLectureId === lec._id ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span className="w-6 shrink-0 text-sm text-gray-400 font-medium tabular-nums">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {lec.title}
                      </p>
                      {lec.videoUrl && (
                        <a
                          href={lec.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-gray-500 hover:text-gray-700 truncate mt-0.5"
                        >
                          {lec.videoUrl}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => startEdit(lec)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(lec)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add lecture */}
      <section
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        aria-label="Add lecture"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Add new lecture
        </h2>
        <form
          key={addFormKey}
          onSubmit={handleAddLecture}
          className="space-y-4 max-w-xl"
        >
          <div>
            <label htmlFor="lecture-title" className="block text-sm font-medium text-gray-700 mb-1">
              Lecture title
            </label>
            <input
              id="lecture-title"
              type="text"
              name="title"
              placeholder="Lecture title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              required
            />
          </div>
          <div>
            <label htmlFor="lecture-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="lecture-description"
              name="description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="lecture-module" className="block text-sm font-medium text-gray-700 mb-1">
              Module
            </label>
            <input
              id="lecture-module"
              type="text"
              name="module"
              placeholder="Module name (optional)"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="lecture-video" className="block text-sm font-medium text-gray-700 mb-1">
              Video upload
            </label>
            <input
              id="lecture-video"
              type="file"
              name="video"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="lecture-thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail upload (optional)
            </label>
            <input
              id="lecture-thumbnail"
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-800"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {submitting ? "Uploading…" : "Add lecture"}
          </button>
        </form>
      </section>

      {/* Delete confirmation */}
      {deleteConfirmLecture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-sm w-full">
            <h3 id="delete-dialog-title" className="text-base font-medium text-gray-900 mb-2">
              Delete lecture?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              “{deleteConfirmLecture.title}” will be permanently removed.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={deletingLectureId !== null}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteLecture}
                disabled={deletingLectureId !== null}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:pointer-events-none"
              >
                {deletingLectureId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCourse;
