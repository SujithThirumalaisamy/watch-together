import { useEffect, useState } from "react";
import UserAvatar from "./user-avatar";
import { useUser } from "../providers/user-provider";
import ReactPlayer from "react-player";
import { useRecoilState, useRecoilValue } from "recoil";
import { clientAtom, playerAtom } from "../../store/atoms";
import { useWebSocket } from "../providers/wsContext";
import { getYoutubeVideoTitle } from "../../store/utils";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components";
import { Share2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [youtubePlayerConfig, setYoutubePlayerConfig] =
    useRecoilState(playerAtom);
  const user = useUser();
  const playerState = useRecoilValue(playerAtom);
  const { isHost } = useRecoilValue(clientAtom);
  const socket = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const getMetaData = async () => {
      if (youtubePlayerConfig.currentlyPlaying) {
        const metadata = await getYoutubeVideoTitle(
          youtubePlayerConfig.currentlyPlaying?.url
        );
        setYoutubePlayerConfig((prev) => {
          return {
            ...prev,
            title: metadata.videoTitle,
          };
        });
      }
    };
    getMetaData();
  }, []);
  const youtubePlayerStyle = {
    border: "15px",
    overflow: "hidden",
    aspectRatio: "16/9",
  };

  const handleOnPlay = () => {
    console.log("Playing On Click");
    socket?.playVideo();
  };

  const handleOnPause = () => {
    console.log("Pausing On Click");
    socket?.pauseVideo();
  };

  return (
    <div className="player-container">
      <div className="flex flex-col w-full">
        <div className="relative">
          {!isHost ? (
            <div
              className="w-full"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                zIndex: 1000,
                width: "90%",
              }}
            ></div>
          ) : null}
          {!youtubePlayerConfig.currentlyPlaying ? (
            <img src="/no-videos.jpg" width={"90%"} height={"auto"} />
          ) : (
            <ReactPlayer
              width={"90%"}
              height={"auto"}
              url={youtubePlayerConfig.currentlyPlaying?.url}
              controls={false}
              style={youtubePlayerStyle}
              config={{
                youtube: {
                  playerVars: { disablekb: 1 },
                },
              }}
              onPlay={handleOnPlay}
              onPause={handleOnPause}
              playing={playerState.isPlaying}
            />
          )}
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <UserAvatar username="ST" url={user.avatarUrl} />
          <h2 className="text-xl font-semibold text-white">
            {youtubePlayerConfig.currentlyPlaying?.title}
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  className="flex gap-3"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <span>Share</span>
                  <Share2Icon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to Copy!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
    </div>
  );
}
