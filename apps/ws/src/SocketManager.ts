import { WebSocket as ws } from "ws";
import db from "@repo/db/src";
export class Client {
  public socket: ws;
  public id: string;
  public clientId: string;
  public partyId: string | null;
  constructor(socket: ws, clientId: string) {
    this.id = "";
    this.socket = socket;
    this.clientId = clientId;
    this.partyId = null;
    db.partyClient
      .findFirst({
        where: {
          clientId,
        },
      })
      .then((client) => {
        if (client) {
          this.id = client.id;
          this.clientId = client.clientId;
        } else {
          db.partyClient
            .create({
              data: {
                clientId,
              },
            })
            .then((client) => {
              this.id = client.id;
              this.clientId = clientId;
            })
            .catch(() => {
              throw new Error("Internal Error!");
            });
        }
      });
  }
}

export class SocketManager {
  private static instance: SocketManager;
  private interestedSockets: Map<string, Client[]>;
  private clientPartyMapping: Map<string, string>;

  private constructor() {
    this.interestedSockets = new Map<string, Client[]>();
    this.clientPartyMapping = new Map<string, string>();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new SocketManager();
    return this.instance;
  }

  addClient(client: Client, partyId: string) {
    this.interestedSockets.set(partyId, [
      ...(this.interestedSockets.get(partyId) || []),
      client,
    ]);
    this.clientPartyMapping.set(client.clientId, partyId);
  }

  broadcast(partyId: string, message: string) {
    const client = this.interestedSockets.get(partyId);
    if (!client) {
      console.error("No client in party?");
      return;
    }

    client.forEach((client) => {
      client.socket.send(message);
    });
  }

  removeclient(client: Client) {
    const partyId = this.clientPartyMapping.get(client.clientId);
    if (!partyId) {
      console.error("client was not interested in any party?");
      return;
    }
    const party = this.interestedSockets.get(partyId) || [];
    const remainingclients = party.filter(
      (u) => u.clientId !== client.clientId
    );
    this.interestedSockets.set(partyId, remainingclients);
    if (this.interestedSockets.get(partyId)?.length === 0) {
      this.interestedSockets.delete(partyId);
    }
    this.clientPartyMapping.delete(client.clientId);
  }
}
