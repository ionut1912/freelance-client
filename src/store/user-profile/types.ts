import type { AxiosError } from "axios";
import type {
  ClientProfileDto,
  FreelancerProfileDto,
} from "../../models/UserProfile";
import type { PaginatedList } from "../../models/Ui";

export interface UserProfileState {
  clientProfiles: ClientProfileDto[] | null;
  freelancerProfiles: FreelancerProfileDto[] | null;
  paginatedUserProfiles: PaginatedList<object> | null;
  loading: boolean;
  error: AxiosError | null;
}
