import { useRecoilValue } from "recoil";
import AddVideo from "./add-video";
import VideoCard from "./video-card";
import { clientAtom, videoQueueAtom } from "../../store/atoms";

export function VideosList() {
  const videos = useRecoilValue(videoQueueAtom);
  const client = useRecoilValue(clientAtom);
  console.log(videos);
  return (
    <div className="space-y-3 py-8 max-h-screen scroll min-w-80">
      {videos.map((video, index) => {
        return (
          <VideoCard url={video.url} key={video.url + index} id={video.id} />
        );
      })}
      {client.isHost ? <AddVideo /> : null}
    </div>
  );
}
