import { Party } from "./Party";
import { Client, SocketManager } from "./SocketManager";
import { WebSocket } from "ws";
import {
  ADD_VIDEO,
  ALREADY_IN_PARTY,
  CURRENT,
  GET_NEXT_VIDEO,
  INIT_PARTY,
  JOIN_PARTY,
  LEAVE_PARTY,
  NEXT_VIDEO,
  NOT_IN_PARTY,
  PARTY_CREATED,
  PARTY_NOT_FOUND,
  PAUSE,
  PLAY,
  REMOVE_VIDEO,
  SEEK,
  VIDEO_ALREADY_EXIST,
  VIDEO_DOES_NOT_EXIST,
  VIDEO_QUEUE,
} from "./messages";
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
          if (client.partyId) {
            return client.socket.send(
              JSON.stringify({ type: ALREADY_IN_PARTY })
            );
          }
          const party = new Party(client);
          this.parties.push(party);
          client.partyId = party.id;
          SocketManager.getInstance().addClient(client, party.id);
          SocketManager.getInstance().broadcast(
            party.id,
            JSON.stringify({ type: PARTY_CREATED, partyId: party.id })
          );
          break;
        }
        case JOIN_PARTY: {
          if (client.partyId) {
            return client.socket.send(
              JSON.stringify({ type: ALREADY_IN_PARTY })
            );
          }
          const party = this.parties.find(({ id }) => id === message.partyId);
          if (!party) {
            return client.socket.send(
              JSON.stringify({ type: PARTY_NOT_FOUND })
            );
          }
          SocketManager.getInstance().addClient(client, party.id);
          SocketManager.getInstance().broadcast(
            party.id,
            JSON.stringify({
              type: CURRENT,
              currentVideo: party.getCurrentVideo(),
              currentTimestamp: party.getCurrentTimestamp(),
            })
          );
          break;
        }
        case LEAVE_PARTY: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          SocketManager.getInstance().removeclient(client);
          party?.removeClient(client.socket);
          break;
        }
        case PLAY: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          if (!party) break;
          party.play(message.timeStamp);
          break;
        }
        case PAUSE: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          if (!party) break;
          party.pause();
          break;
        }
        case ADD_VIDEO: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          if (!party) {
            return client.socket.send(JSON.stringify({ type: NOT_IN_PARTY }));
          }
          try {
            party.addVideo(message.videoURL);
          } catch (e) {
            client.socket.send(JSON.stringify({ type: VIDEO_ALREADY_EXIST }));
          }
          SocketManager.getInstance().broadcast(
            party.id,
            JSON.stringify({
              type: VIDEO_QUEUE,
              videoQueue: party.getVideoQueue(),
            })
          );
          break;
        }
        case REMOVE_VIDEO: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          if (!party) {
            return client.socket.send(JSON.stringify({ type: NOT_IN_PARTY }));
          }
          try {
            party.removeVideo(message.videoURL);
          } catch (e) {
            client.socket.send(JSON.stringify({ type: VIDEO_DOES_NOT_EXIST }));
          }
          break;
        }
        case GET_NEXT_VIDEO: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          if (!party) {
            return client.socket.send(JSON.stringify({ type: NOT_IN_PARTY }));
          }
          try {
            return client.socket.send(
              JSON.stringify({
                type: NEXT_VIDEO,
                videoURL: party.getNextVideo(),
              })
            );
          } catch (e) {
            client.socket.send(JSON.stringify({ type: VIDEO_DOES_NOT_EXIST }));
          }
          break;
        }

        case SEEK: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          if (!party) {
            return client.socket.send(
              JSON.stringify({ type: PARTY_NOT_FOUND })
            );
          }
          party.setCurrentTimestamp(message.timeStamp);
          SocketManager.getInstance().broadcast(
            party.id,
            JSON.stringify({
              type: SEEK,
              timeStamp: message.timeStamp,
            })
          );
        }
      }
    });
  }
}
