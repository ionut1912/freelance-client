import { List } from "@mui/material";

import type { UserRole } from "../../../models/UserProfile";

import NavigationItem from "./NavigationItem";
import { NAV_ITEMS } from "./navItems";

interface Props {
  role: UserRole;
}

const Navigation = ({ role }: Props) => {
  const navigationItemsList = NAV_ITEMS[role].map((item) => {
    return <NavigationItem key={Object.values(item).toString()} item={item} />;
  });

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, padding: 2 }}
      component="nav"
      aria-label="Main navigation"
    >
      {navigationItemsList}
    </List>
  );
};

export default Navigation;
