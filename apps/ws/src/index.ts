import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import url from "url";
import { Client } from "./SocketManager";
import { PartyManager } from "./PartyManager";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const partyManager = new PartyManager();

wss.on("connection", async function connection(ws, req: IncomingMessage) {
  if (typeof req.url !== "string") return;
  const userId: string | string[] | undefined = url.parse(req.url, true).query
    .userId;
  try {
    if (typeof userId === "string") {
      partyManager.addClient(new Client(ws, userId));
    }
  } catch (e) {
    ws.terminate();
  }

  ws.on("close", () => {
    partyManager.removeClient(ws);
  });
});
