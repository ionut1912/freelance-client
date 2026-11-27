import type { AxiosResponse } from "axios";

import type { CreateClientProfileRequest } from "../models/UserProfile";

import { api, API_URL } from "./utils";

export function createClientProfile(
  payload: CreateClientProfileRequest,
): Promise<AxiosResponse<void>> {
  return api.post(`${API_URL}/clientProfiles`, payload, {
    headers: { "requires-auth": "" },
  });
}
