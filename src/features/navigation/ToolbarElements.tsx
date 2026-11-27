import { Stack } from "@mui/material";

import Spinner from "../../components/ui/Spinner";
import { useCurrentProfile } from "../../hooks/useCurrentProfile";
import type { UserRole } from "../../models/UserProfile";

import UserMenu from "./user-menu/UserMenu";
interface ToolbarElementsProps {
  role: UserRole;
}

const ToolbarElements = ({ role }: ToolbarElementsProps) => {
  const { profile, loading } = useCurrentProfile(role);
  if (loading) {
    return <Spinner />;
  }

  return (
    <Stack direction="row" spacing={2}>
      {profile !== undefined && <UserMenu profile={profile} />}
    </Stack>
  );
};

export default ToolbarElements;
