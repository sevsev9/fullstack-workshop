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

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  archived: boolean;
};

type Props = {
  onTodoCreated: (newTask: Todo) => void; // TODO should return the created Task
};

export default function CreateTodoButton({ onTodoCreated }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!title.trim()) {
      toast("Enter a name in order to create new lobby");
      return;
    }

    // TODO
    // handle save

    setLoading(true);

    new Promise<void>((res, rej) => {
      setTimeout(() => res(), 2000);
    })
      .then(() => {
        toast("New Todo created");
        const newTodo = {
          id: "temp",
          title,
          archived: false,
          completed: false,
        };

        onTodoCreated(newTodo);
        setTitle("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Todo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Todo</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Lobby name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button disabled={loading} type="submit">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
