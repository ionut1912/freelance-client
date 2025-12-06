import type { SkillDto } from "../../models/UserProfile";

export interface SkillsState {
  skills: SkillDto[];
  error: string | null;
  loading: boolean;
}
