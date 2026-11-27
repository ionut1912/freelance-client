import type { AxiosResponse } from "axios";

import type { SkillDto } from "../models/UserProfile";

import { api, API_URL } from "./utils";

export default function getSkills(): Promise<AxiosResponse<SkillDto[]>> {
  return api.get<SkillDto[]>(`${API_URL}/skills`, {
    headers: { "requires-auth": "" },
  });
}
