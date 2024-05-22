import { WebSocket } from "ws";
import { Client, SocketManager } from "./SocketManager";
import { randomUUID } from "crypto";

export class Party {
  id: string;
  private host: Client;
  private clients: Client[];
  private videos: string[];
  private currentVideo: string | null;

  constructor(host: Client) {
    this.id = randomUUID();
    this.host = host;
    this.clients = [];
    this.videos = [];
    this.currentVideo = null;
  }

  addClient(client: Client) {
    this.clients.push(client);
    client.socket.emit("message", this.currentVideo);
  }

  removeClient(socket: WebSocket) {
    const client = this.clients.find((client) => client.socket === socket);
    if (!client) {
      console.error("client not found?");
      return;
    }
    this.clients = this.clients.filter((client) => client.socket !== socket);
    SocketManager.getInstance().removeclient(client);
  }

  addVideo(video: string) {
    this.videos.push(video);
  }

  removeVideo(video: string) {
    this.videos = this.videos.filter((v: string) => {
      return v !== video;
    });
  }

  setCurrentVideo(video: string) {
    this.currentVideo = video;
  }

  getNextVideo() {
    const nextVideo = this.videos.pop();
    if (nextVideo) this.setCurrentVideo(nextVideo);
  }
}
