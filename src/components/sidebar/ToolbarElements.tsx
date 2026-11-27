import { Stack } from "@mui/material";

import { useCurrentUser } from "../../hooks/useCurerentUser";
import type { UserRole } from "../../models/UserProfile";
import Spinner from "../wrappers/Spinner";

import UserMenu from "./user-menu/UserMenu";
interface ToolbarElementsProps {
  role: UserRole;
}

const ToolbarElements = ({ role }: ToolbarElementsProps) => {
  const { freelancerProfile, clientProfile, loading } = useCurrentUser();
  if (loading) {
    return <Spinner />;
  }
  const profile = role === "Freelancer" ? freelancerProfile : clientProfile;

  return (
    <Stack direction="row" spacing={2}>
      {profile !== undefined && <UserMenu profile={profile} />}
    </Stack>
  );
};

export default ToolbarElements;
