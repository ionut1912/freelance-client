import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  useTheme,
} from "@mui/material";
import type { ReactNode } from "react";

import type { UserRole } from "../../models/UserProfile";

import { drawerWidth } from "./constants";
import { Logo } from "./Logo/Logo";
import Navigation from "./menu/Navigation";
import { AppBar } from "./styled/AppBar";
import { DrawerHeader } from "./styled/DrawerHeader";
import { Main } from "./styled/Main";
import ToolbarElements from "./ToolbarElements";
import { useAppNavigation } from "./useAppNavigation";

interface SideBarLayoutProps {
  children: ReactNode;
  role: UserRole;
}

const SideBarLayout: React.FC<SideBarLayoutProps> = ({ children, role }) => {
  const theme = useTheme();
  const { isSidebarOpen, toggleSidebar } = useAppNavigation();

  return (
    <Box>
      <AppBar position="relative" open={isSidebarOpen} color="transparent">
        <Toolbar>
          <Stack
            justifyContent={isSidebarOpen ? "flex-end" : "space-between"}
            direction="row"
            flex={1}
            alignItems="center"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            <IconButton
              color="inherit"
              aria-label="open navigation"
              onClick={toggleSidebar}
              edge="start"
              sx={{ mr: 2, ...(isSidebarOpen && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <ToolbarElements role={role} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        elevation={0}
        variant="persistent"
        anchor="left"
        open={isSidebarOpen}
      >
        <DrawerHeader>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Logo role={role} />
          </Stack>
          <IconButton onClick={toggleSidebar}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Navigation role={role} />
      </Drawer>
      <Main open={isSidebarOpen}>{children}</Main>
    </Box>
  );
};

export default SideBarLayout;
