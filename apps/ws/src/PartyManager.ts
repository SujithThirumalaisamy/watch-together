import { Party } from "./Party";
import { Client, SocketManager } from "./SocketManager";
import { WebSocket as ws } from "ws";
import {
  ADD_VIDEO,
  ALREADY_IN_PARTY,
  CLIENT_JOINED,
  CLIENT_LEAVED,
  CURRENT,
  GET_NEXT_VIDEO,
  INIT_PARTY,
  IS_HOST,
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
} from "@repo/common/messages";
import db from "@repo/db/src";
export class PartyManager {
  private parties: Party[];
  private clients: Client[];
  constructor() {
    this.parties = [];
    this.clients = [];
  }

  deleteParty(id: string) {
    this.parties = this.parties.filter((party) => party.id !== id);
    db.party.delete({ where: { id } });
  }

  addClient(client: Client) {
    this.clients.push(client);
    this.addHandler(client);
  }

  removeClient(socket: ws) {
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
          db.party
            .create({
              data: {
                description: message.partyDescription,
                hostId: client.id,
                title: message.partyTitle,
              },
            })
            .then((data) => {
              party.id = data.id;
              this.parties.push(party);
              client.partyId = party.id;
              SocketManager.getInstance().addClient(client, party.id);
              SocketManager.getInstance().broadcast(
                party.id,
                JSON.stringify({ type: PARTY_CREATED, partyId: party.id })
              );
            })
            .catch(() => {
              client.socket.send(JSON.stringify({ type: "internal_error" }));
            });
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
              JSON.stringify({
                type: PARTY_NOT_FOUND,
                partyId: message.partyId,
              })
            );
          }
          if (party.getHost().id === client.id) {
            SocketManager.getInstance().addClient(client, party.id);
            const dbParty = await db.party.findFirst({
              where: { id: party.id },
              include: { videos: true },
            });
            if (!dbParty) return;
            SocketManager.getInstance().broadcast(
              party.id,
              JSON.stringify({
                type: VIDEO_QUEUE,
                videos: dbParty.videos.map((video) => {
                  return {
                    ...video,
                    duration: video.duration.toString(),
                  };
                }),
              })
            );
            client.partyId = party.id;
            return client.socket.send(JSON.stringify({ type: IS_HOST }));
          }
          SocketManager.getInstance().addClient(client, party.id);
          SocketManager.getInstance().broadcast(
            party.id,
            JSON.stringify({ type: CLIENT_JOINED, clientId: client.id })
          );
          client.socket.send(
            JSON.stringify({
              type: CURRENT,
              currentVideo: party.getCurrentVideo(),
              currentTimestamp: party.getCurrentTimestamp(),
            })
          );
          const dbParty = await db.party.findFirst({
            where: { id: party.id },
            include: { videos: true },
          });
          if (!dbParty) return;
          client.socket.send(
            JSON.stringify({
              type: VIDEO_QUEUE,
              videos: dbParty.videos.map((video) => {
                return {
                  ...video,
                  duration: video.duration.toString(),
                };
              }),
            })
          );
          break;
        }

        case LEAVE_PARTY: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          SocketManager.getInstance().removeclient(client);
          if (!party) return;
          SocketManager.getInstance().broadcast(
            party.id,
            JSON.stringify({ type: CLIENT_LEAVED, clientId: client.id })
          );
          party.removeClient(client.socket);
          break;
        }

        case PLAY: {
          const party = this.parties.find(
            (party) => party.id === client.partyId
          );
          if (!party) break;
          party.play(client, message.timeStamp);
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
          const dbParty = await party.addVideo(message.videoURL).catch((e) => {
            client.socket.send(JSON.stringify({ type: VIDEO_ALREADY_EXIST }));
          });
          if (dbParty) {
            SocketManager.getInstance().broadcast(
              party.id,
              JSON.stringify({
                type: VIDEO_QUEUE,
                videos: dbParty.videos.map((video) => {
                  return {
                    ...video,
                    duration: video.duration.toString(),
                  };
                }),
              })
            );
          }
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
            const newQueue = await party.removeVideo(message.videoId);
            return SocketManager.getInstance().broadcast(
              party.id,
              JSON.stringify({ type: VIDEO_QUEUE, videos: newQueue })
            );
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
              JSON.stringify({
                type: PARTY_NOT_FOUND,
                partyId: message.partyId,
              })
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
