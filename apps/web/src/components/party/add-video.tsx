import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Button,
} from "@ui/components";
import { useState } from "react";
import { useWebSocket } from "../providers/wsContext";

export default function AddVideo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const socket = useWebSocket();

  function handleAddVideo() {
    socket?.addVideo?.(videoLink);
    setIsDialogOpen(false);
  }
  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          onClick={() => setIsDialogOpen(true)}
        >
          Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
          <DialogDescription>Enter the Youtube Video URL</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="video-url"
              placeholder="Video URL"
              className="col-span-4"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            onClick={handleAddVideo}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
