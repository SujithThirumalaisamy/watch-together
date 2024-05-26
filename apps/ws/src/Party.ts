import { WebSocket as ws } from "ws";
import { Client, SocketManager } from "./SocketManager";
import { randomUUID } from "crypto";
import {
  CLIENT_JOINED,
  CLIENT_LEAVED,
  PAUSE,
  PLAY,
} from "@repo/common/messages";
import db from "@repo/db/src";
import { Party as PartyType } from "@prisma/client";
import { getYoutubeVideoMetadata } from "./utils";

export class Party {
  id: string;
  private host: Client;
  private clients: Client[];
  private videos: string[];
  private currentVideo: string | null;
  private currentTimestamp: number;

  constructor(host: Client, partyMetaData: Omit<PartyType, "id" | "hostId">) {
    db.party
      .create({
        data: {
          description: partyMetaData.description,
          hostId: host.id,
          title: partyMetaData.title,
        },
      })
      .then((data) => {
        console.log(data);
      });
    this.id = randomUUID();
    this.host = host;
    this.clients = [];
    this.videos = [];
    this.currentVideo = null;
    this.currentTimestamp = 0;
  }

  addClient(client: Client) {
    this.clients.push(client);
    // [Feature]: Add logic to make Host User as host when Rejoin
    db.partyClient.update({
      where: { id: client.id },
      data: { partyId: this.id },
    });
    SocketManager.getInstance().broadcast(
      this.id,
      JSON.stringify({ type: CLIENT_JOINED, clientId: client.id })
    );
    client.socket.emit("message", this.currentVideo);
  }

  removeClient(socket: ws) {
    const client = this.clients.find((client) => client.socket === socket);
    if (!client) {
      console.error("client not found?");
      return;
    }
    this.clients = this.clients.filter((client) => client.socket !== socket);
    db.partyClient.update({
      where: { id: client.id },
      data: { partyId: null },
    });
    SocketManager.getInstance().removeclient(client);
    SocketManager.getInstance().broadcast(
      this.id,
      JSON.stringify({ type: CLIENT_LEAVED, clientId: client.id })
    );
  }

  async addVideo(video: string) {
    console.log(video);
    const videoId = new URL(video).searchParams.get("v");
    if (!videoId) return;
    const { duration, thumbnailURL, title } =
      await getYoutubeVideoMetadata(videoId);
    if (!this.videos.includes(video)) {
      await db.party.update({
        where: { id: this.id },
        data: {
          videos: {
            create: {
              duration: parseInt(duration),
              title,
              url: video,
              thumbnailURL,
            },
          },
        },
      });
      this.videos.push(video);
      SocketManager.getInstance().broadcast(
        this.id,
        JSON.stringify({
          duration: parseInt(duration),
          title,
          url: video,
          thumbnailURL,
        })
      );
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

  play(host: Client, timeStamp = 0) {
    if (this.host !== host) {
      SocketManager.getInstance().broadcast(
        this.id,
        JSON.stringify({
          type: PLAY,
          message: "UnAuthorized",
        })
      );
    }
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
