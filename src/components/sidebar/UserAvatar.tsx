import React from "react";
import type {
  ClientProfileDto,
  FreelancerProfileDto,
} from "../../models/UserProfile";
import { Avatar, type AvatarProps } from "@mui/material";

interface UserAvatarProps extends AvatarProps {
  profile: ClientProfileDto | FreelancerProfileDto;
}

const UserAvatar = ({ profile, ...props }: UserAvatarProps) => {
  return (
    <Avatar
      src={profile.image}
      {...props}
      sx={{
        ...props.sx,
        boxShadow: 3,
        borderRadius: "50%",
        overflow: "hidden",
      }}
    />
  );
};

export default UserAvatar;
