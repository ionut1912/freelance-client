import {
  CreateFreelancerProfileRequest,
  PatchFreelancerProfielRequest,
} from "../models/UserProfile";
import { api, API_URL } from "./utils";
import { AxiosResponse } from "axios";
``;
export function createFreelancerProfile(
  payload: CreateFreelancerProfileRequest,
): Promise<AxiosResponse<void>> {
  return api.post(`${API_URL}/freelancerProfiles`, payload, {
    headers: { "requires-auth": "" },
  });
}

export function updateFreelancerProfileData(
  payload: PatchFreelancerProfielRequest,
): Promise<AxiosResponse<void>> {
  return api.patch(
    `${API_URL}/freelancerProfiles/freelancerDetails/${payload.profileId}`,
    payload.freelancerData,
    { headers: { "requires-auth": "" } },
  );
}
