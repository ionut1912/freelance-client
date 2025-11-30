import type { AxiosResponse } from "axios";
import type { LoginDto, RegisterDto, UserDto } from "../models/Accounts";
import { api, API_URL } from "./utils";

export function register(payload: RegisterDto): Promise<AxiosResponse<void>> {
  return api.post<void>(`${API_URL}/auth/register`, payload);
}

export function login(payload: LoginDto): Promise<AxiosResponse<UserDto>> {
  return api.post<UserDto>(`${API_URL}/auth/login`, payload);
}

export function blockAccount(id: number): Promise<AxiosResponse<void>> {
  return api.post<void>(
    `${API_URL}/auth/block/${id}`,
    {},
    { headers: { "requires-auth": "" } },
  );
}

export function deleteAccount(id: number): Promise<AxiosResponse<void>> {
  return api.delete<void>(`${API_URL}/auth/account/${id}`, {
    headers: { "requires-auth": "" },
  });
}

export function deleteCurrentAccount(): Promise<AxiosResponse<void>> {
  return api.delete<void>(`${API_URL}/auth/account/current`, {
    headers: { "requires-auth": "" },
  });
}
