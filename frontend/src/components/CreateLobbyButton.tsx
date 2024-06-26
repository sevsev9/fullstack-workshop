import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  onSubmit: (params: { name: string }) => void;
};

export default function CreateLobbyButton({ onSubmit }: Props) {
  const [lobbyName, setLobbyName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(lobbyName);

    if (!lobbyName.trim()) {
      toast("Enter a name in order to create new lobby");
      return;
    }

    onSubmit({
      name: lobbyName,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Lobby</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Lobby</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Lobby name"
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
          />
          <Button type="submit">Create Lobby</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
