import React from "react";

const VideoCanvas = ({ videoRef, muted }) => {
  return (
    <video
      playsInline
      muted={muted}
      ref={videoRef}
      autoPlay
      className="w-full h-full object-cover"
    />
  );
};

export default VideoCanvas;
