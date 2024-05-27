import { WebSocket as ws } from "ws";
import { Client, SocketManager } from "./SocketManager";
import { randomUUID } from "crypto";
import { PAUSE, PLAY } from "@repo/common/messages";
import db from "@repo/db/src";
import { getYoutubeVideoMetadata } from "./utils";

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
    client.socket.send(JSON.stringify(this.currentVideo));
    db.partyClient.update({
      where: { id: client.id },
      data: { partyId: this.id },
    });
  }

  removeClient(socket: ws) {
    const client = this.clients.find((client) => client.socket === socket);
    if (!client) {
      return;
    }
    this.clients = this.clients.filter((client) => client.socket !== socket);
    db.partyClient.update({
      where: { id: client.id },
      data: { partyId: null },
    });
  }

  async addVideo(video: string) {
    const videoId = new URL(video).searchParams.get("v");
    if (!videoId) return;
    const { duration, thumbnailURL, title } =
      await getYoutubeVideoMetadata(videoId);
    if (!this.videos.includes(video)) {
      const party = await db.party.update({
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
        include: { videos: true },
      });
      this.videos.push(video);
      return party;
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

  getHost() {
    return this.host;
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
