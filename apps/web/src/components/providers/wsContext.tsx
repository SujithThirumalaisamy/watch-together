import {
  ADD_VIDEO,
  CURRENT,
  GET_NEXT_VIDEO,
  INIT_PARTY,
  IS_HOST,
  JOIN_PARTY,
  LEAVE_PARTY,
  PARTY_CREATED,
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
import { useToast } from "@ui/components/ui/use-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { clientAtom, playerAtom, videoQueueAtom } from "../../store/atoms";

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
    console.log("sent");
  }

  function joinParty(partyId: string) {
    socket?.send(JSON.stringify({ type: JOIN_PARTY, partyId }));
  }

  function leaveParty() {
    socket?.send(JSON.stringify({ type: LEAVE_PARTY }));
  }

  function playVideo() {
    socket?.send(JSON.stringify({ type: PLAY }));
  }

  function pauseVideo() {
    socket?.send(JSON.stringify({ type: PAUSE }));
  }

  function addVideo(videoURL: string) {
    setVideoQueue((prev) => [...prev, { url: videoURL }]);
    socket?.send(JSON.stringify({ type: ADD_VIDEO, videoURL }));
  }

  function removeVideo(videoId: string) {
    socket?.send(JSON.stringify({ type: REMOVE_VIDEO, videoId }));
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
          setPlayerState((prev) => ({ ...prev, isPlaying: true }));
          break;
        }
        case CURRENT: {
          console.log(message);
          break;
        }
        case VIDEO_QUEUE: {
          setVideoQueue(message.videos);
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
