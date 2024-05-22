import { VideosList } from "./party/videos-list";

export default function PartyLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex h-screen w-screen">
      {children}
      <VideosList />
    </div>
  );
}
