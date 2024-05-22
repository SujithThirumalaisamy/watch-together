import { WebSocketServer } from "ws";
import url from "url";
import { Client } from "./SocketManager";
import { PartyManager } from "./PartyManager";

const wss = new WebSocketServer({ port: 8080 });

const partyManager = new PartyManager();

wss.on("connection", function connection(ws, req: { url: string }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const userId: string = url.parse(req.url, true).query.userId;
  partyManager.addClient(new Client(ws, userId));

  ws.on("close", () => {
    partyManager.removeClient(ws);
  });
});
