import { useEffect } from "react";
import { useWebSocket } from "../providers/wsContext";
import { VideosList } from "./videos-list";
import { useParams } from "react-router-dom";

export default function PartyLayout({ children }: { children: JSX.Element }) {
  const socket = useWebSocket();
  const { partyId } = useParams();
  useEffect(() => {
    if (socket) {
      socket.socket.onopen = () => {
        socket?.joinParty(partyId);
      };
    }
  }, [partyId, socket]);
  return (
    <div className="flex h-screen w-screen p-8">
      {children}
      <VideosList />
    </div>
  );
}
