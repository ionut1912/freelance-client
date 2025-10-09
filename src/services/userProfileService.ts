import { AxiosResponse } from "axios";
import {
  PaginatedDataRequest,
  PaginatedList,
  UpdateUserRequest,
} from "../models/Ui";
import { api, API_URL } from "./utils";
import { PatchUserProfileAddressRequest } from "../models/UserProfile";

export function getUserProfiles(
  payload: PaginatedDataRequest,
): Promise<AxiosResponse<PaginatedList<object>>> {
  return api.get<PaginatedList<object>>(
    `${API_URL}/userProfiles?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
    {
      headers: { "requires-auth": "" },
    },
  );
}

export function getCurrentUserProfile(): Promise<AxiosResponse<object>> {
  return api.get<object>(`${API_URL}/current/userProfiles`, {
    headers: { "requires-auth": "" },
  });
}

export function updateUserProfileAddress(
  payload: PatchUserProfileAddressRequest,
): Promise<AxiosResponse<void>> {
  return api.patch(
    `${API_URL}/userProfiles/address/${payload.profileId}`,
    payload.address,
    { headers: { "requires-auth": "" } },
  );
}

export function verifyUserProfile(id: number): Promise<AxiosResponse<void>> {
  return api.patch(
    `${API_URL}/userProfiles/verify/${id}`,
    {},
    { headers: { "requires-auth": "" } },
  );
}

export function deleteUserProfile(id: number): Promise<AxiosResponse<void>> {
  return api.delete(`${API_URL}/userProfiles/${id}`, {
    headers: { "requires-auth": "" },
  });
}

export function updateImage(image: string): Promise<AxiosResponse<void>> {
  return api.patch(
    `${API_URL}/userProfiles`,
    { image },
    {
      headers: { "requires-auth": "" },
    },
  );
}

export function updateUserData(
  userDataRequest: UpdateUserRequest,
): Promise<AxiosResponse<void>> {
  return api.patch(`${API_URL}/userProfiles/userData`, userDataRequest, {
    headers: { "requires-auth": "" },
  });
}
