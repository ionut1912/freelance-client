import type { AxiosError } from "axios";
import type { UserDto } from "../../models/Accounts";
import type { UserRole } from "../../models/UserProfile";

export interface AuthState {
  user: UserDto | null;
  role: UserRole | null;
  error: AxiosError | null;
}
