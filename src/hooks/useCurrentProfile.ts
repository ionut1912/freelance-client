import { useSelector } from "react-redux";

import type { UserRole } from "../models/UserProfile";
import type { RootState } from "../store";

import { useCurrentUser } from "./useCurrentUser";

/** The current user's profile for `role`, by default the signed-in one. */
export function useCurrentProfile(role?: UserRole) {
  const storedRole = useSelector((state: RootState) => state.auth.role);
  const { clientProfile, freelancerProfile, loading } = useCurrentUser();
  const profile =
    (role ?? storedRole) === "Client" ? clientProfile : freelancerProfile;

  return { profile, loading };
}
