import { parseISOTime } from "../components/util";

const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function getYoutubeVideoTitle(videoId: string) {
  console.log("Fetching Metadata");
  const metadata = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
  );
  const response = await metadata.json();
  return {
    videoTitle: response.items[0]?.snippet.title,
  };
}

export async function getYoutubeVideoMetadata(videoId: string) {
  console.log("Fetching Metadata");
  const metadata = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
  );
  const response = await metadata.json();
  let title;
  if (response.items[0].snippet.title.length < 35) {
    title = response.items[0]?.snippet.title;
  } else {
    title = response.items[0]?.snippet.title.slice(0, 35) + "...";
  }
  return {
    thumbnailURL: response.items[0]?.snippet.thumbnails.medium.url,
    title,
    duration: parseISOTime(response.items[0].contentDetails.duration),
  };
}
