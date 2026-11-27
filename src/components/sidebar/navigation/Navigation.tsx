import {
  AccountBoxOutlined,
  DashboardOutlined,
  AppsOutlined,
  CalendarMonthOutlined,
  ListAltOutlined,
  AccountBalanceOutlined,
  CodeOutlined,
  BusinessOutlined,
} from "@mui/icons-material";
import { List, type SvgIconProps } from "@mui/material";
import { useMemo } from "react";

import type { NavigationItemType } from "../../../models/Ui";
import type { UserRole } from "../../../models/UserProfile";
import { routesLinks } from "../../../routes/index";

import NavigationItem from "./NavigationItem";

interface Props {
  role: UserRole;
}

const NAV_ITEMS: Record<UserRole, NavigationItemType[]> = {
  Client: [
    {
      header: "Dashboards",
    },
    {
      path: routesLinks.client,
      label: "Dashboard",
      icon: (props: SvgIconProps) => <DashboardOutlined {...props} />,
    },
    {
      header: "Pages",
    },
    {
      label: "Profile",
      icon: (props: SvgIconProps) => <AccountBoxOutlined {...props} />,
      description: "Profile management",
      items: [
        {
          path: routesLinks.userProfile,
          label: "My Profile",
        },
      ],
    },
    {
      label: "Freelancers",
      icon: (props: SvgIconProps) => <CodeOutlined {...props} />,
      description: "Freelancers data",
      items: [
        {
          path: routesLinks.availableFreelancers,
          disabled: true,
          label: "Available Freelancers",
        },
        {
          path: routesLinks.myFreelancers,
          disabled: true,
          label: "My Freelancers",
        },
      ],
    },
    {
      label: "Project",
      icon: (props: SvgIconProps) => <AppsOutlined {...props} />,
      description: "Projects management",
      items: [
        {
          path: routesLinks.projects,
          disabled: true,
          label: "My Projects",
        },
        {
          path: routesLinks.proposals,
          disabled: true,
          label: "Proposals",
        },
      ],
    },
    {
      label: "Finance",
      icon: (props: SvgIconProps) => <AccountBalanceOutlined {...props} />,
      description: "Finance management",
      items: [
        {
          path: routesLinks.invoices,
          disabled: true,
          label: "My Invoices",
        },
        {
          path: routesLinks.contracts,
          disabled: true,
          label: "My Contracts",
        },
        {
          path: routesLinks.payments,
          disabled: true,
          label: "Payments",
        },
      ],
    },
    {
      header: "Apps",
    },
    {
      path: routesLinks.calendar,
      label: "Calendar",
      icon: (props: SvgIconProps) => <CalendarMonthOutlined {...props} />,
    },
    {
      path: routesLinks.boards,
      disabled: true,
      label: "Projects Boards",
      icon: (props: SvgIconProps) => <ListAltOutlined {...props} />,
    },
  ],
  Freelancer: [
    {
      header: "Dashboards",
    },
    {
      path: routesLinks.freelancer,
      label: "Dashboard",
      icon: (props: SvgIconProps) => <DashboardOutlined {...props} />,
    },
    {
      header: "Pages",
    },
    {
      label: "Profile",
      icon: (props: SvgIconProps) => <AccountBoxOutlined {...props} />,
      description: "Profile management",
      items: [
        {
          path: routesLinks.userProfile,
          label: "My Profile",
        },
      ],
    },
    {
      label: "Clients",
      icon: (props: SvgIconProps) => <BusinessOutlined {...props} />,
      description: "Clients data",
      items: [
        {
          path: routesLinks.availableClients,
          disabled: true,
          label: "Available Clients",
        },
        {
          path: routesLinks.myClients,
          disabled: true,
          label: "My Clients",
        },
      ],
    },
    {
      label: "Project",
      icon: (props: SvgIconProps) => <AppsOutlined {...props} />,
      description: "Projects management",
      items: [
        {
          path: routesLinks.projects,
          disabled: true,
          label: "My Projects",
        },
        {
          path: routesLinks.proposals,
          disabled: true,
          label: "My Proposals",
        },
        {
          path: routesLinks.allProjects,
          disabled: true,
          label: "All Projects",
        },
      ],
    },
    {
      label: "Finance",
      icon: (props: SvgIconProps) => <AccountBalanceOutlined {...props} />,
      description: "Finance management",
      items: [
        {
          path: routesLinks.invoices,
          disabled: true,
          label: "My Invoices",
        },
        {
          path: routesLinks.contracts,
          disabled: true,
          label: "My Contracts",
        },
        {
          path: routesLinks.payments,
          disabled: true,
          label: "Payments",
        },
      ],
    },
    {
      header: "Apps",
    },
    {
      path: routesLinks.calendar,
      label: "Calendar",
      icon: (props: SvgIconProps) => <CalendarMonthOutlined {...props} />,
    },
    {
      path: routesLinks.boards,
      disabled: true,
      label: "Projects Boards",
      icon: (props: SvgIconProps) => <ListAltOutlined {...props} />,
    },
  ],
};

const Navigation = ({ role }: Props) => {
  const navigationItems = useMemo(() => NAV_ITEMS[role], [role]);
  const navigationItemsList = navigationItems.map((item) => {
    return <NavigationItem key={Object.values(item).toString()} item={item} />;
  });

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, padding: 2 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {navigationItemsList}
    </List>
  );
};

export default Navigation;
