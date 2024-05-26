import { useEffect, useState } from "react";
import ListIcon from "../icons/list-icon";
import TrashIcon from "../icons/trash-icon";
import { getYoutubeVideoMetadata } from "../../store/utils";

export default function VideoCard({ url }: { url: string }) {
  const videoId = new URL(url).searchParams.get("v");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("00:00");
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
        {/* <div>{JSON.stringify(metadata)}</div> */}
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
      <div className="flex space-x-2">
        <ListIcon className="text-white h-4 w-4 cursor-grab" />
        <TrashIcon className="text-white h-4 w-4 cursor-pointer" />
      </div>
    </div>
  );
}
