import { ACCESS_TOKEN_KEY } from "@/utils/localstorage.constants";
import { type ServiceResult } from "@/types/service.types";

const API_URL = "http://localhost:8080/api";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

export type ApiPutResponse<T> = {
  message: string;
  updates: T;
};

type ApiGetRequest = {
  endpoint: string;
  authRequired?: boolean;
  headers?: Record<string, string>;
};

type ApiPostRequest<T> = {
  endpoint: string;
  body?: T;
  authRequired?: boolean;
  headers?: Record<string, string>;
};

const getHeaders = (headers: Record<string, string>, authRequired: boolean) => {
  if (authRequired) {
    headers["Authorization"] = `${localStorage.getItem(ACCESS_TOKEN_KEY)}`;
  }
  return headers;
};

export const apiGet = async <Out>({
  endpoint,
  authRequired = false,
  headers = defaultHeaders,
}: ApiGetRequest): Promise<ServiceResult<Out>> => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(headers, authRequired),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = res.json() as Out;

    return {
      success: true,
      data,
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);

    return {
      success: false,
      message: "failed",
    };
  }
};

export const apiPost = async <Body, Out>({
  endpoint,
  body,
  authRequired = false,
  headers = defaultHeaders,
}: ApiPostRequest<Body>): Promise<ServiceResult<Out>> => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(headers, authRequired),
      ...(body && {
        body: JSON.stringify(body),
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = (await res.json()) as Out;
    return {
      success: true,
      data,
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);

    return {
      success: false,
      message: "failed",
    };
  }
};

export const apiPut = async <Body, Out>({
  endpoint,
  body,
  authRequired = false,
  headers = defaultHeaders,
}: ApiPostRequest<Body>): Promise<ServiceResult<ApiPutResponse<Out>>> => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(headers, authRequired),
      ...(body && {
        body: JSON.stringify(body),
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = (await res.json()) as Out;
    return {
      success: true,
      data,
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);

    return {
      success: false,
      message: "failed",
    };
  }
};
