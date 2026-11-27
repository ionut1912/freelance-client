import type { AxiosResponse } from "axios";

import type {
  CreateFreelancerProfileRequest,
  PatchFreelancerProfileRequest,
} from "../models/UserProfile";

import { api, API_URL } from "./utils";

export function createFreelancerProfile(
  payload: CreateFreelancerProfileRequest,
): Promise<AxiosResponse<void>> {
  return api.post(`${API_URL}/freelancerProfiles`, payload, {
    headers: { "requires-auth": "" },
  });
}

export function updateFreelancerProfileData(
  payload: PatchFreelancerProfileRequest,
): Promise<AxiosResponse<void>> {
  return api.patch(
    `${API_URL}/freelancerProfiles/freelancerDetails/${payload.profileId}`,
    payload.freelancerData,
    { headers: { "requires-auth": "" } },
  );
}
