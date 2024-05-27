import {
  ADD_VIDEO,
  CLIENT_JOINED,
  CLIENT_LEAVED,
  CURRENT,
  GET_NEXT_VIDEO,
  INIT_PARTY,
  IS_HOST,
  JOIN_PARTY,
  LEAVE_PARTY,
  NEXT_VIDEO,
  PARTY_CREATED,
  PARTY_NOT_FOUND,
  PAUSE,
  PLAY,
  REMOVE_VIDEO,
  SEEK,
  VIDEO_ALREADY_EXIST,
  VIDEO_QUEUE,
} from "@repo/common/messages";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./user-provider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@ui/components";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Video,
  clientAtom,
  playerAtom,
  videoQueueAtom,
} from "../../store/atoms";

type WebSocketContextType = {
  socket: WebSocket;
  createParty: CallableFunction;
  joinParty: CallableFunction;
  leaveParty: CallableFunction;
  playVideo: CallableFunction;
  pauseVideo: CallableFunction;
  addVideo: CallableFunction;
  removeVideo: CallableFunction;
  getNextVideo: CallableFunction;
  seek: CallableFunction;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const user = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const setHost = useSetRecoilState(clientAtom);
  const setVideoQueue = useSetRecoilState(videoQueueAtom);
  const [playerState, setPlayerState] = useRecoilState(playerAtom);

  function createParty(partyTitle: string, partyDescription: string) {
    socket?.send(
      JSON.stringify({ type: INIT_PARTY, partyTitle, partyDescription })
    );
    toast({
      title: "Party Created!",
      description: partyTitle,
    });
  }

  function joinParty(partyId: string) {
    socket?.send(JSON.stringify({ type: JOIN_PARTY, partyId }));
    toast({
      title: "Joined Party!",
      description: partyId,
    });
  }

  function leaveParty() {
    socket?.send(JSON.stringify({ type: LEAVE_PARTY }));
    toast({
      title: "Left Party!",
    });
  }

  function playVideo() {
    socket?.send(JSON.stringify({ type: PLAY }));
    toast({
      title: "Playing Now!",
      description: playerState.currentlyPlaying?.title,
    });
  }

  function pauseVideo() {
    socket?.send(JSON.stringify({ type: PAUSE }));
    toast({
      description: "Paused!",
    });
  }

  function addVideo(videoURL: string) {
    toast({
      title: "Video Added to Queue!",
      description: videoURL,
    });
    socket?.send(JSON.stringify({ type: ADD_VIDEO, videoURL }));
  }

  function removeVideo(videoURL: string) {
    toast({
      title: "Video Removed from Queue!",
      description: videoURL,
    });
    socket?.send(JSON.stringify({ type: REMOVE_VIDEO, videoURL }));
  }

  function getNextVideo() {
    socket?.send(JSON.stringify({ type: GET_NEXT_VIDEO }));
  }

  function seek(timeStamp: number) {
    socket?.send(JSON.stringify({ type: SEEK, timeStamp }));
  }

  useEffect(() => {
    if (user === null) return;
    const ws: WebSocket = new WebSocket(
      import.meta.env.VITE_APP_WS_URL + "?userId=" + user.id
    );
    setSocket(ws);

    ws.onopen = () => {
      toast({
        title: "Connected!",
        description: "WebSocket server connected sucessfully",
      });
    };

    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data.toString());
      switch (message.type) {
        case PARTY_CREATED: {
          toast({
            title: "Party Created!",
            description: "New Watch Party Created Successfully",
          });
          setHost((prev) => ({ ...prev, isHost: true }));
          navigate("/party/" + message.partyId);
          break;
        }
        case PLAY: {
          toast({
            title: "Playing Now!",
            description: playerState.currentlyPlaying?.title,
          });
          setPlayerState((prev) => ({ ...prev, isPlaying: true }));
          break;
        }
        case PAUSE: {
          toast({
            description: "Paused!",
          });
          setPlayerState((prev) => ({ ...prev, isPlaying: false }));
          break;
        }
        case SEEK: {
          setPlayerState((prev) => ({
            ...prev,
            currentDuration: message.timeStamp,
          }));
          break;
        }
        case CURRENT: {
          setPlayerState((prev) => ({
            ...prev,
            currentlyPlaying: message.currentVideo,
            currentDuration: message.currentTimestamp,
          }));
          break;
        }
        case VIDEO_QUEUE: {
          setVideoQueue(message.videos);
          if (!playerState.currentlyPlaying) {
            setPlayerState((prev) => ({
              ...prev,
              currentDuration: 0,
              currentlyPlaying: message.videos[0],
            }));
          }
          break;
        }
        case VIDEO_ALREADY_EXIST: {
          setVideoQueue((prev) => {
            return prev.slice(0, -1);
          });
          break;
        }
        case IS_HOST: {
          setHost({ isHost: true });
          break;
        }
        case CLIENT_JOINED: {
          toast({
            title: "Viewer Joined!",
            description: message.clientId,
          });
          break;
        }
        case CLIENT_LEAVED: {
          toast({
            title: "Viewer Left!",
            description: message.clientId,
          });
          break;
        }
        case PARTY_NOT_FOUND: {
          toast({
            title: "Party Not Found!",
            description: "Unable to find a party",
            variant: "destructive",
          });
          break;
        }
        case NEXT_VIDEO: {
          let nextVideo: Video;
          setVideoQueue((prev) => {
            const [first, ...rest] = prev;
            nextVideo = first;
            return rest;
          });
          setPlayerState(() => {
            return {
              currentDuration: 0,
              isPlaying: true,
              currentlyPlaying: nextVideo,
            };
          });
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [user]);

  if (socket) {
    return (
      <WebSocketContext.Provider
        value={{
          socket,
          createParty,
          joinParty,
          leaveParty,
          playVideo,
          pauseVideo,
          addVideo,
          removeVideo,
          getNextVideo,
          seek,
        }}
      >
        {children}
      </WebSocketContext.Provider>
    );
  }
  return <>{children}</>;
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
