import {
  ADD_VIDEO,
  GET_NEXT_VIDEO,
  INIT_PARTY,
  JOIN_PARTY,
  LEAVE_PARTY,
  PARTY_CREATED,
  PAUSE,
  PLAY,
  REMOVE_VIDEO,
  SEEK,
} from "@repo/common/messages";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./user-provider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@ui/components/ui/use-toast";

type WebSocketContextType = {
  socket: WebSocket;
  createParty: CallableFunction;
  joinPary: CallableFunction;
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

  function createParty(partyTitle: string, partyDescription: string) {
    socket?.send(
      JSON.stringify({ type: INIT_PARTY, partyTitle, partyDescription })
    );
    console.log("sent");
  }

  function joinPary(partyId: string) {
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

  function addVideo(videoId: string) {
    socket?.send(JSON.stringify({ type: ADD_VIDEO, videoId }));
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
      import.meta.env.VITE_APP_WS_URL + "?userId=" + user.name
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
          navigate("/party/" + message.partyId);
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
          joinPary,
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
