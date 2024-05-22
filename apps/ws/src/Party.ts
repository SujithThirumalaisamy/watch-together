import { WebSocket } from "ws";
import { Client, SocketManager } from "./SocketManager";
import { randomUUID } from "crypto";
import {
  CLIENT_JOINED,
  CLIENT_LEAVED,
  PAUSE,
  PLAY,
} from "@repo/common/messages";

export class Party {
  id: string;
  private host: Client;
  private clients: Client[];
  private videos: string[];
  private currentVideo: string | null;
  private currentTimestamp: number;

  constructor(host: Client) {
    this.id = randomUUID();
    this.host = host;
    this.clients = [];
    this.videos = [];
    this.currentVideo = null;
    this.currentTimestamp = 0;
  }

  addClient(client: Client) {
    this.clients.push(client);
    SocketManager.getInstance().broadcast(
      this.id,
      JSON.stringify({ type: CLIENT_JOINED, clientId: client.id })
    );
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
    SocketManager.getInstance().broadcast(
      this.id,
      JSON.stringify({ type: CLIENT_LEAVED, clientId: client.id })
    );
  }

  addVideo(video: string) {
    if (!this.videos.includes(video)) {
      this.videos.push(video);
    } else {
      throw new Error("Video Already Exists");
    }
  }

  getCurrentVideo() {
    return this.currentVideo;
  }

  getVideoQueue() {
    return this.videos;
  }

  removeVideo(video: string) {
    if (this.videos.includes(video)) {
      this.videos = this.videos.filter((v: string) => {
        return v !== video;
      });
    } else {
      throw new Error("Video Already Exists");
    }
  }

  setCurrentVideo(video: string) {
    this.currentVideo = video;
  }

  getNextVideo() {
    if (this.videos.length !== 0) {
      const nextVideo = this.videos.pop();
      if (nextVideo) this.setCurrentVideo(nextVideo);
    } else {
      throw new Error("No More Videos in Queue");
    }
  }

  play(timeStamp = 0) {
    SocketManager.getInstance().broadcast(
      this.id,
      JSON.stringify({
        type: PLAY,
        currentVideo: this.currentVideo,
        timeStamp,
      })
    );
  }

  pause() {
    SocketManager.getInstance().broadcast(
      this.id,
      JSON.stringify({
        type: PAUSE,
      })
    );
  }

  setCurrentTimestamp(timeStamp: number) {
    this.currentTimestamp = timeStamp;
  }

  getCurrentTimestamp() {
    return this.currentTimestamp;
  }
}
