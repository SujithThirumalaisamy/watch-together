import { useEffect, useRef, useState } from "react";
import UserAvatar from "./user-avatar";
import { useUser } from "../providers/user-provider";
import ReactPlayer from "react-player";

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
  const user = useUser();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
  }, [youtubePlayerConfig.videoId]);
  const youtubePlayerStyle = {};

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="flex flex-col w-3/4 p-8" onClick={(e) => handleClick(e)}>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${youtubePlayerConfig.videoId}`}
        controls={false}
        style={youtubePlayerStyle}
        config={{
          youtube: {
            playerVars: { disablekb: 1 },
          },
        }}
        playing={isPlaying}
      />
      <div className="flex items-center space-x-2 mt-2">
        <UserAvatar username="ST" url={user.avatarUrl} />
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
