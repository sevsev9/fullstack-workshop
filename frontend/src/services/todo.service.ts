import { User } from "../../../backend/src/model/user.model";
import { apiGet, apiPost, apiPut } from "./api";

export type UpdateUserProps = {
  username?: string;
  email?: string;
  password?: string;
};

export const getTodos = async () => {
  return await apiGet<User>({
    endpoint: "/todo",
  });
};

export const addTodo = async () => {
  return await apiPost<User, User>({
    endpoint: "/todo",
  });
};

export const deleteTodo = async (id: string) => {
  return await apiGet<User>({
    endpoint: `/todo/${id}`,
  });
};

export const updateTodo = async () => {
  return await apiPut<User, User>({
    endpoint: "/todo",
  });
};
