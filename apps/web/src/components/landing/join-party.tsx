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
import { Link, useNavigate } from "react-router-dom";
import { useWebSocket } from "../providers/wsContext";
import { useUser } from "../providers/user-provider";

export function JoinParty() {
  const [partyId, setPartyId] = useState("");
  const ws = useWebSocket();
  const user = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePartyJoin = () => {
    if (!user) {
      toast({
        title: "UnAuthorized",
        description: "Login to create a Party",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      ws?.joinParty(partyId);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        >
          Join Party
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Party</DialogTitle>
          <DialogDescription>Enter the Party ID</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="party-id"
              placeholder="Party ID"
              className="col-span-4"
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter onClick={handlePartyJoin}>
          <Link to={"/party/" + partyId}>
            <Button
              variant={"outline"}
              className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            >
              Join
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
