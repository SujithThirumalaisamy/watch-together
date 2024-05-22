import VideoCard from "./video-card";

const videos = [
  {
    url: "https://www.youtube.com/watch?v=l5bRPWxun4A",
  },
  {
    url: "https://www.youtube.com/watch?v=ypw5ZZ7BZDI",
  },
  {
    url: "https://www.youtube.com/watch?v=qP7LzZqGh30",
  },
  {
    url: "https://www.youtube.com/watch?v=D5CGlFQbgnk",
  },
  {
    url: "https://www.youtube.com/watch?v=Wb6MmUa0bu0",
  },
  {
    url: "https://www.youtube.com/watch?v=dbhurBoV9po",
  },
  {
    url: "https://www.youtube.com/watch?v=NiP8OBpXCsY",
  },
];

export function VideosList() {
  return (
    <div className="space-y-3 py-8 max-h-screen scroll">
      {videos.map((video) => {
        return <VideoCard url={video.url} />;
      })}
    </div>
  );
}
