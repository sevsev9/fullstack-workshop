import { useState } from "react";
import { TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  archived: boolean;
};

type Props = {
  todo: Todo;
  onRemove: (id: string) => void;
};

export default function TodoCard({ todo, onRemove }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateTask = (title: string) => {
    toggleEditing();
    toast("Task updated.");
  };

  const toggleEditing = () => {
    setIsEditing((p) => !p);
  };

  return (
    <>
      {isEditing ? (
        <EditTodoView
          title={todo.title}
          onCancel={toggleEditing}
          onSubmit={handleUpdateTask}
        />
      ) : (
        <DefaultTodoView
          todo={todo}
          onEdit={toggleEditing}
          onRemove={onRemove}
        />
      )}
    </>
  );
}

function DefaultTodoView({
  todo,
  onEdit,
  onRemove,
}: {
  todo: Todo;
  onEdit: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-3xl text-lg p-4 gap-4 flex justify-between items-center bg-slate-100 hover:bg-slate-200 transition-colors border-2 border-transparent">
      <div className="flex items-center gap-4 w-full">
        <Checkbox />
        <button onClick={onEdit} className="w-full text-start">
          {todo.title}
        </button>
      </div>
      <div className="gap-2 flex items-center">
        <Button variant="ghost" onClick={() => onRemove(todo.id)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function EditTodoView(props: {
  title: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(props.title);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast("Enter a title!");
    }

    props.onSubmit(title);
  };

  return (
    <div
      className={
        "rounded-3xl text-lg p-4 gap-4 flex justify-between items-center bg-slate-100 hover:bg-slate-200 transition-colors border-2 border-purple-500"
      }
    >
      <form onSubmit={handleSubmit} className="flex-1 w-full">
        <Input
          autoFocus
          value={title}
          onBlur={props.onCancel}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-lg border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-0"
          placeholder="Your todo..."
        />
      </form>
      <div className="gap-2 flex items-center">
        <Button>Save</Button>
        <Button variant="outline" onClick={props.onCancel}>
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
