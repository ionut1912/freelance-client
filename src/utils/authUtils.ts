import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import type { NavigateFunction } from "react-router-dom";
import { jwtDecode, type JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { routesLinks } from "../routes/index";

interface JwtPayload extends DefaultJwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return (
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      null
    );
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const createAuthAxios = (baseURL: string): AxiosInstance => {
  const api = axios.create({ baseURL });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if ("requires-auth" in config.headers) {
      delete (config.headers as Record<string, unknown>)["requires-auth"];
      const token = localStorage.getItem("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return api;
};

export const navigateByRole = (
  role: string | null,
  navigate: NavigateFunction,
): void => {
  switch (role) {
    case "Freelancer":
      void navigate(routesLinks.freelancer);
      break;
    case "Client":
      void navigate(routesLinks.client);
      break;
    default:
      void navigate(routesLinks.home);
  }
};

interface ErrorResponse {
  message?: string;
}

export const handleHttpError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response?.data.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  return "An unexpected error occurred.";
};
