import {
  ADD_VIDEO,
  GET_NEXT_VIDEO,
  JOIN_PARTY,
  LEAVE_PARTY,
  PAUSE,
  PLAY,
  REMOVE_VIDEO,
  SEEK,
} from "@repo/common/messages";
import { createContext, useContext, useEffect, useState } from "react";

type WebSocketContextType = {
  socket: WebSocket;
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
    const ws: WebSocket = new WebSocket(
      "ws://localhost:8080?userId=sujiththiru"
    );
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  if (socket) {
    return (
      <WebSocketContext.Provider
        value={{
          socket,
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
