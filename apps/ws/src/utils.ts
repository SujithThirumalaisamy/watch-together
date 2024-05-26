import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.YOUTUBE_API_KEY || null;

export function parseISOTime(isoTime: string) {
  return isoTime
    .replace(/(^PT|S$)/g, "")
    .split(/[^\d]/)
    .map((item) => (item.length < 2 ? "0" + item : item))
    .join(":")
    .replace(/^0/, "");
}

export async function getYoutubeVideoMetadata(videoId: string) {
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
