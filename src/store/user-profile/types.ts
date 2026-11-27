import type { AxiosError } from "axios";

import type { PaginatedList } from "../../models/Ui";
import type {
  ClientProfileDto,
  FreelancerProfileDto,
} from "../../models/UserProfile";

export interface UserProfileState {
  clientProfiles: ClientProfileDto[] | null;
  freelancerProfiles: FreelancerProfileDto[] | null;
  paginatedUserProfiles: PaginatedList<object> | null;
  loading: boolean;
  loadFailed: boolean;
  error: AxiosError | null;
}
