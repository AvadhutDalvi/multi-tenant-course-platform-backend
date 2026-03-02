import React from "react";

function VideoSection({ lecture }) {
  if (!lecture) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex items-center justify-center min-h-[260px]">
        <p className="text-gray-600 text-sm">
          Select a lecture from the sidebar to start learning.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-black aspect-video w-full flex items-center justify-center">
        {lecture.videoUrl ? (
          <video
            key={lecture._id}
            src={lecture.videoUrl}
            controls
            className="w-full h-full"
          />
        ) : (
          <p className="text-gray-400 text-sm">
            No video URL configured for this lecture.
          </p>
        )}
      </div>
      <div className="p-5 border-t border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          {lecture.title}
        </h2>
        {lecture.duration && (
          <p className="text-xs text-gray-500 mt-1">{lecture.duration}</p>
        )}
      </div>
    </section>
  );
}

export default VideoSection;

