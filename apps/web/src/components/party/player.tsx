import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import UserAvatar from "./user-avatar";
import { useWebSocket } from "../providers/wsContext";

const users = [
  { url: "/placeholder.svg", username: "Sujith Thirumalaisam" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisa" },
  { url: "/placeholder.svg", username: "Sujith Thirumalais" },
  { url: "/placeholder.svg", username: "Sujith Thirumalai" },
  { url: "/placeholder.svg", username: "Sujith Thirumala" },
  { url: "/placeholder.svg", username: "Sujith Thirumal" },
  { url: "/placeholder.svg", username: "Sujith Thiruma" },
  { url: "/placeholder.svg", username: "Sujith Thirum" },
  { url: "/placeholder.svg", username: "Sujith Thiru" },
  { url: "/placeholder.svg", username: "Sujith Thir" },
  { url: "/placeholder.svg", username: "Sujith Thi" },
  { url: "/placeholder.svg", username: "Sujith Th" },
  { url: "/placeholder.svg", username: "Sujith T" },
];

export default function Player() {
  const [youtubePlayerConfig, setYoutubePlayerConfig] = useState({
    videoId: "Op8CXz0IRqE",
    id: "Op8CXz0IRqE",
    className: "player",
    iframeClassName: "player-container",
    title: "",
  });
  useEffect(() => {
    const getMetaData = async () => {
      const metadata = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${youtubePlayerConfig.videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );
      const response = await metadata.json();
      setYoutubePlayerConfig((prev) => {
        return {
          ...prev,
          title: response.items[0]?.snippet.title,
        };
      });
    };
    getMetaData();
  }, []);
  const youtubePlayerOpts = {};
  const youtubePlayerStyle = {};
  const onReady = () => {};
  const onPlay = () => {};
  const onPause = () => {};
  const onEnd = () => {};
  const onError = () => {};
  const onStateChange = () => {};
  const onPlaybackRateChange = () => {};
  const onPlaybackQualityChange = () => {};

  const socket = useWebSocket();
  useEffect(() => {
    if (!socket?.socket.onmessage) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    socket.socket.onopen(() => {
      console.log("Open");
    });
    socket?.socket.onmessage((event) => {
      console.log(event.data);
      return event.data;
    });
  }, [socket]);
  // const { toast } = useToast();
  // toast({
  //   title: "Connected!",
  //   description: "WebSocket server connected sucessfully",
  // });
  return (
    <div className="flex flex-col w-3/4 p-8">
      <YouTube
        videoId={youtubePlayerConfig.videoId}
        id={youtubePlayerConfig.id}
        className={youtubePlayerConfig.className}
        iframeClassName={youtubePlayerConfig.iframeClassName}
        style={youtubePlayerStyle}
        title={youtubePlayerConfig.title}
        loading={"lazy"}
        opts={youtubePlayerOpts}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onError={onError}
        onStateChange={onStateChange}
        onPlaybackRateChange={onPlaybackRateChange}
        onPlaybackQualityChange={onPlaybackQualityChange}
      />
      <div className="flex items-center space-x-2 mt-2">
        <UserAvatar username="ST" url="/placeholder.svg" />
        <h2 className="text-xl font-semibold text-white">
          {youtubePlayerConfig.title}
        </h2>
      </div>
      <div className="flex items-center mt-2 space-x-2">
        {users.slice(0, 8).map((user) => {
          return (
            <UserAvatar
              username={user.username}
              url={user.url}
              key={user.username}
            />
          );
        })}
        {users.length - 8 > 0 && (
          <span className="text-white">{users.length - 8}+ Peoples</span>
        )}
      </div>
    </div>
  );
}
