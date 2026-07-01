import { useState } from "react";

const VIDEO_SRC = "/background_video.mp4";

export function VideoBackground() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {!videoFailed ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover scale-105"
          onError={() => setVideoFailed(true)}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0612] via-[#120818] to-[#060a14]" />
      )}

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
    </div>
  );
}
