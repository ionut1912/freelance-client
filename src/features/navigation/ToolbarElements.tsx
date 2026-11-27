import { Stack } from "@mui/material";

import Spinner from "../../components/ui/Spinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { UserRole } from "../../models/UserProfile";

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
