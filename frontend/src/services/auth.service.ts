import { apiPost } from "@/services/api";
import { type User } from "../../../backend/src/model/user.model";

export type LoginProps = {
  email: string;
  password: string;
};

export type RefreshTokenProps = {
  refreshToken?: string;
};

export type RegisterProps = LoginProps & {
  username: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

export const login = async (credentials: LoginProps) => {
  return await apiPost<LoginProps, LoginResponse>({
    endpoint: "/auth/login",
    body: credentials,
  });
};

export const register = async (props: RegisterProps) => {
  return await apiPost<RegisterProps, void>({
    endpoint: "/auth/register",
    body: props,
  });
};

export const refreshToken = async (props: RefreshTokenProps) => {
  return await apiPost<RefreshTokenProps, void>({
    endpoint: "/auth/refresh",
    body: props,
  });
};

export const logout = async () => {
  return await apiPost({
    endpoint: "/auth/logout",
  });
};
