import { useRef, useState } from "react";

function VideoPlayer({ lecture }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ================= EMPTY STATE =================
  if (!lecture) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <p className="text-slate-500 text-sm">
          Select a lecture to start learning
        </p>
      </div>
    );
  }

  // ================= NO VIDEO =================
  if (!lecture.video?.url) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="aspect-video flex items-center justify-center bg-slate-100">
          <p className="text-slate-400 text-sm">
            No video available
          </p>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

      {/* VIDEO CONTAINER */}
      <div className="relative aspect-video bg-black">

        <video
          ref={videoRef}
          src={lecture.videoUrl}
          className="w-full h-full object-contain"
          controls={isPlaying}
        />

        {/* OVERLAY */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

            <button
              onClick={handlePlay}
              className="w-16 h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-105 transition active:scale-95"
            >
              ▶
            </button>

          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="p-4 space-y-2">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-slate-900">
          {lecture.title}
        </h2>

        {/* DESCRIPTION */}
        {lecture.description && (
          <p className="text-sm text-slate-500 leading-relaxed">
            {lecture.description}
          </p>
        )}

      </div>
    </div>
  );
}

export default VideoPlayer;