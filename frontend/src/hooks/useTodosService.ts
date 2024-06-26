import { toast } from "sonner";
import { useUserContext } from "@/context/AuthContext";
import * as todoService from "@/services/todo.service";
import { UpdateUserProps } from "@/services/user.service";

export default function useTodosServices() {
  const { updateUserState } = useUserContext();

  const getAllTodos = async (updateProps: UpdateUserProps) => {
    const result = await todoService.getTodos();
    if (!result.success) {
      toast(result.message);
    } else {
      toast("Profile updated successfully");
      updateUserState(result.data.updates);
    }
  };

  const updateTodo = async (updateProps: UpdateUserProps) => {
    const result = await todoService.updateTodo(updateProps);
    if (!result.success) {
      toast(result.message);
    } else {
      toast("Profile updated successfully");
      updateUserState(result.data.updates);
    }
  };

  const deleteTodo = async (updateProps: UpdateUserProps) => {
    const result = await todoService.updateTodo(updateProps);
    if (!result.success) {
      toast(result.message);
    } else {
      toast("Profile updated successfully");
      updateUserState(result.data.updates);
    }
  };

  const createTodo = async (updateProps: UpdateUserProps) => {
    const result = await todoService.updateTodo(updateProps);
    if (!result.success) {
      toast(result.message);
    } else {
      toast("Profile updated successfully");
      updateUserState(result.data.updates);
    }
  };

  return {
    createTodo,
    updateTodo,
    deleteTodo,
    getAllTodos,
  };
}
