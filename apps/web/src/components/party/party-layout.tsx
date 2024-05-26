import { VideosList } from "./videos-list";

export default function PartyLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex h-screen w-screen p-8">
      {children}
      <VideosList />
    </div>
  );
}
