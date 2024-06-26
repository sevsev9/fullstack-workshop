import { User } from "../../../backend/src/model/user.model";
import { apiGet, apiPut } from "./api";

export type UpdateUserProps = {
  username?: string;
  email?: string;
  password?: string;
};

export const getProfile = async () => {
  return await apiGet<User>({
    endpoint: "/user/profile",
  });
};

export const updateProfile = async (props: UpdateUserProps) => {
  return await apiPut<UpdateUserProps, Partial<User>>({
    endpoint: "/user/profile",
    body: props,
  });
};
