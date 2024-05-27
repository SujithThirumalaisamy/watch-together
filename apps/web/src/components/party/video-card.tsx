import { useEffect, useState } from "react";
import ListIcon from "../icons/list-icon";
import TrashIcon from "../icons/trash-icon";
import { getYoutubeVideoMetadata } from "../../store/utils";
import { useWebSocket } from "../providers/wsContext";
import { useRecoilValue } from "recoil";
import { clientAtom } from "../../store/atoms";

export default function VideoCard({ url, id }: { url: string; id: string }) {
  const videoId = new URL(url).searchParams.get("v");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("00:00");
  const ws = useWebSocket();
  const client = useRecoilValue(clientAtom);

  useEffect(() => {
    const getMetadata = async () => {
      if (!videoId) return;
      const metadata = await getYoutubeVideoMetadata(videoId);
      setThumbnail(metadata.thumbnailURL);
      setTitle(metadata.title);
      setDuration(metadata.duration);
    };
    getMetadata();
  }, [videoId]);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg space-x-2 w-80">
      <div className="flex items-center">
        {thumbnail ? (
          <img
            style={{ aspectRatio: "16/9" }}
            className="bg-gray-700 mr-4 w-24"
            src={thumbnail}
          />
        ) : (
          <></>
        )}
        <div>
          <h3 className="text-white text-xs">{title}</h3>
          <p className="text-gray-400 text-xs">{duration}</p>
        </div>
      </div>
      {client.isHost ? (
        <div className="flex space-x-2">
          <ListIcon className="text-white h-4 w-4 cursor-grab" />
          <span onClick={() => ws?.removeVideo(id)}>
            <TrashIcon className="text-white h-4 w-4 cursor-pointer" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
