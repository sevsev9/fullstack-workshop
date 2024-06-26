import HomeLayout from "@/layouts/HomeLayout";
import CreateTodoButton from "@/components/CreateTodoButton";
import { useState } from "react";
import TodoCard from "@/components/TodoCard";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  archived: boolean;
};

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Play CS",
    completed: false,
    archived: false,
  },
  {
    id: "2",
    title: "Go outside",
    completed: false,
    archived: false,
  },
  {
    id: "3",
    title: "Drink coffee",
    completed: false,
    archived: false,
  },
];

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);

  const onTodoCreated = (newTodo: Todo) => {
    setTodos((p) => [...p, newTodo]);
  };

  const handleRemoveTodo = (id: string) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Lobbies</h1>
      <CreateTodoButton onTodoCreated={onTodoCreated} />

      <section className="space-y-2">
        {todos.map((todo, i) => (
          <TodoCard key={i} todo={todo} onRemove={handleRemoveTodo} />
        ))}
      </section>
    </div>
  );
}

Dashboard.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};
