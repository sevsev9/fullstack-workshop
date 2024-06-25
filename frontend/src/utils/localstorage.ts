export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

export const getLocalStorageItem = (key: string) => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};
