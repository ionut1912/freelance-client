import type { AxiosError } from "axios";
import type { SkillDto } from "../../models/UserProfile";

export interface SkillsState {
  skills: SkillDto[];
  error: AxiosError | null;
  loading: boolean;
}
