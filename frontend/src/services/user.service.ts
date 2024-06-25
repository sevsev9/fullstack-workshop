import { User } from "../../../backend/src/model/user.model";
import { apiGet } from "./api";

export const getProfile = async () => {
  return await apiGet<User>({
    endpoint: "/user/profile",
    authRequired: true,
  });
};
