import axios from "axios";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/utils/localstorage";
import { PutServiceResult, ServiceResult } from "@/types/service.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultHeaders = {
  "Content-Type": "application/json",
};

// Create Axios instance with baseURL and default headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: defaultHeaders,
});

// Function to refresh tokens
const refreshToken = async () => {
  try {
    const refreshToken = getLocalStorageItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      "http://localhost:8080/api/auth/refresh",
      {
        refresh_token: refreshToken,
      },
    );

    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;
      setLocalStorageItem(ACCESS_TOKEN_KEY, access_token);
      setLocalStorageItem(REFRESH_TOKEN_KEY, refresh_token);
      return access_token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// Axios request interceptor for adding access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getLocalStorageItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Axios response interceptor for handling token expiration
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expired error
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const accessToken = await new Promise<string>((resolve, reject) => {
            refreshSubscribers.push((token) => {
              resolve(token);
            });
          });
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshToken()
          .then((newToken) => {
            isRefreshing = false;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
            refreshSubscribers.forEach((callback) => callback(newToken));
            refreshSubscribers = [];
          })
          .catch((error) => {
            isRefreshing = false;
            reject(error);
          });
      });
    }

    return Promise.reject(error);
  },
);

// Type for API request options
type ApiRequestOptions = {
  headers?: Record<string, string>;
};

// Function to make GET request
export const apiGet = async <Out>({
  endpoint,
  headers = {},
}: ApiRequestOptions & { endpoint: string }): Promise<ServiceResult<Out>> => {
  try {
    const response = await axiosInstance.get(endpoint, {
      headers,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);

    return {
      success: false,
      message: "Failed to fetch data",
    };
  }
};

// Function to make POST request
export const apiPost = async <Body, Out>({
  endpoint,
  body,
  headers = {},
}: ApiRequestOptions & { endpoint: string; body?: Body }): Promise<
  ServiceResult<Out>
> => {
  try {
    const response = await axiosInstance.post(endpoint, body, {
      headers,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Failed to post data:", error);

    return {
      success: false,
      message: "Failed to post data",
    };
  }
};

// Function to make PUT request
export const apiPut = async <Body, Out>({
  endpoint,
  body,
  headers = {},
}: ApiRequestOptions & { endpoint: string; body?: Body }): Promise<
  PutServiceResult<Out>
> => {
  try {
    const response = await axiosInstance.put(endpoint, body, {
      headers,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Failed to put data:", error);

    return {
      success: false,
      message: "Failed to put data",
    };
  }
};
