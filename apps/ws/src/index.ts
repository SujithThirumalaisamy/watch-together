import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import url from "url";
import { Client } from "./SocketManager";
import { PartyManager } from "./PartyManager";
import db from "@repo/db/src";
const wss = new WebSocketServer({ port: 8080 });

const partyManager = new PartyManager();

wss.on("connection", async function connection(ws, req: IncomingMessage) {
  console.log("NewConnection");
  //@ts-ignore
  const usersWithCount = await db.party.findMany({
    include: {
      _count: {
        select: { partyclients: true },
      },
    },
  });
  const parties = await db.party.findMany();
  console.log(parties);
  if (typeof req.url !== "string") return;
  const userId: string | string[] | undefined = url.parse(req.url, true).query
    .userId;

  console.log("Working");
  console.log(usersWithCount);

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
