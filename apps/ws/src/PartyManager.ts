import { Party } from "./Party";
import { Client, SocketManager } from "./SocketManager";
import { WebSocket } from "ws";
import { INIT_PARTY, JOIN_PARTY, LEAVE_PARTY, PARTY_CREATED } from "./messages";
export class PartyManager {
  private parties: Party[];
  private clients: Client[];
  constructor() {
    this.parties = [];
    this.clients = [];
  }

  deleteParty(id: string) {
    this.parties = this.parties.filter((party) => party.id !== id);
  }

  addClient(client: Client) {
    this.clients.push(client);
    this.addHandler(client);
  }

  removeClient(socket: WebSocket) {
    const client = this.clients.find((client) => client.socket === socket);
    if (!client) {
      console.error("Client not found!");
      return;
    }
    this.clients = this.clients.filter((client) => client.socket !== socket);
    SocketManager.getInstance().removeclient(client);
  }
  private addHandler(client: Client) {
    client.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      switch (message.type) {
        case INIT_PARTY: {
          const party = new Party(client);
          this.parties.push(party);
          SocketManager.getInstance().addClient(client, party.id);
          SocketManager.getInstance().broadcast(
            party.id,
            JSON.stringify({ type: PARTY_CREATED })
          );
          break;
        }
        case JOIN_PARTY: {
          const party = this.parties.find(({ id }) => id === message.partyId);
          party?.addClient(client);
          party?.broadcastCurrent(client);
          break;
        }
        case LEAVE_PARTY: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          party?.removeClient(client.socket);
        }
      }
    });
  }
}
