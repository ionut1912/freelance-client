import { Avatar, type AvatarProps } from "@mui/material";

import type {
  ClientProfileDto,
  FreelancerProfileDto,
} from "../../models/UserProfile";

interface UserAvatarProps extends AvatarProps {
  profile: ClientProfileDto | FreelancerProfileDto;
}

const UserAvatar = ({ profile, ...props }: UserAvatarProps) => {
  return (
    <Avatar
      src={profile.image}
      {...props}
      // `sx` may be an object, a function or an array, so compose as an array.
      sx={[
        ...[props.sx ?? false].flat(),
        { boxShadow: 3, borderRadius: "50%", overflow: "hidden" },
      ]}
    />
  );
};

export default UserAvatar;
