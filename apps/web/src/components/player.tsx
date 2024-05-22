import { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";
import { useToast } from "@ui/components/ui/use-toast";
import UserAvatar from "./party/user-avatar";

const users = [
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
  { url: "/placeholder.svg", username: "Sujith Thirumalaisamy" },
];

export default function Player() {
  const [youtubePlayerConfig, setYoutubePlayerConfig] = useState({
    videoId: "Op8CXz0IRqE",
    id: "Op8CXz0IRqE",
    className: "player",
    iframeClassName: "player-container",
    title: "",
  });
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

  const webSocketRef = useRef<null | WebSocket>(null);
  const { toast } = useToast();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    if (!ws) return;
    ws.addEventListener("open", () => {
      toast({
        title: "Connected!",
        description: "WebSocket server connected sucessfully",
      });
      console.log("Connected to WS Successfully");
    });
    ws.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });
    webSocketRef.current = ws;
    return () => {
      webSocketRef.current?.close();
    };
  }, []);
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
          This is the title of the video
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
