import { Typography } from "@mui/material";
import { useState, type MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import type {
  ClientProfileDto,
  FreelancerProfileDto,
} from "../../../models/UserProfile";
import { routesLinks } from "../../../routes/index";
import type { AppDispatch } from "../../../store";
import { logout } from "../../../store/auth/slice";
import UserAvatar from "../UserAvatar";

import { UserMenuContainer } from "./styled/UserMenuContainer";
import { UserMenuIconButton } from "./styled/UserMenuIconButton";
import { UserMenuInfo } from "./styled/UserMenuInfo";
import { UserMenuMenu } from "./styled/UserMenuMenu";
import { UserMenuMenuItem } from "./styled/UserMenuMenuItem";
import { UserMenuMenuItemWithSeparator } from "./styled/UserMenuMenuItemWithSeparator";

interface UserMenuProps {
  profile: ClientProfileDto | FreelancerProfileDto;
}

const UserMenu = ({ profile }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const openAccount = () => {
    handleClose();
    void navigate(routesLinks.userProfile);
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <UserMenuContainer>
      <UserMenuIconButton sx={{ padding: 0 }} onClick={handleClick}>
        <UserAvatar profile={profile} />
      </UserMenuIconButton>
      <UserMenuMenu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
      >
        <UserMenuInfo>
          <Typography fontSize={14} color="text.secondary">
            {profile.user.email}
          </Typography>
        </UserMenuInfo>
        <UserMenuMenuItem onClick={openAccount}>Profile</UserMenuMenuItem>
        <UserMenuMenuItem onClick={openAccount}>My account</UserMenuMenuItem>
        <UserMenuMenuItemWithSeparator onClick={handleLogout}>
          Logout
        </UserMenuMenuItemWithSeparator>
      </UserMenuMenu>
    </UserMenuContainer>
  );
};

export default UserMenu;
