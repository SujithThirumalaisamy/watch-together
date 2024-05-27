import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useToast,
  Input,
  Button,
} from "@ui/components";
import { useState } from "react";
import { useWebSocket } from "../providers/wsContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../providers/user-provider";

export function CreateParty() {
  const [partyTitle, setpartyTitle] = useState("");
  const [partyDesc, setpartyDesc] = useState("");
  const ws = useWebSocket();
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = useUser();

  function handleCreateParty() {
    if (!user) {
      toast({
        title: "UnAuthorized",
        description: "Login to create a Party",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      ws?.createParty(partyTitle, partyDesc);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        >
          Create Party
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Party</DialogTitle>
          <DialogDescription>Enter the Party Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="party-title"
              placeholder="Party Title"
              className="col-span-4"
              value={partyTitle}
              onChange={(e) => setpartyTitle(e.target.value)}
            />
            <Input
              id="party-desc"
              placeholder="Party Description"
              className="col-span-4"
              value={partyDesc}
              onChange={(e) => setpartyDesc(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={handleCreateParty}
            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
