import { WebSocket as ws } from "ws";
export class Client {
  public socket: ws;
  public id: string;
  public partyId: string;
  constructor(socket: ws, userId: string) {
    this.id = userId;
    this.socket = socket;
    this.partyId = "";
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
    this.clientPartyMapping.set(client.id, partyId);
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
    const partyId = this.clientPartyMapping.get(client.id);
    if (!partyId) {
      console.error("client was not interested in any party?");
      return;
    }
    const party = this.interestedSockets.get(partyId) || [];
    const remainingclients = party.filter((u) => u.id !== client.id);
    this.interestedSockets.set(partyId, remainingclients);
    if (this.interestedSockets.get(partyId)?.length === 0) {
      this.interestedSockets.delete(partyId);
    }
    this.clientPartyMapping.delete(client.id);
  }
}
