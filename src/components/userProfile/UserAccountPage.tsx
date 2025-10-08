import React from "react";
import { useCurrentUser } from "../../hooks/useCurerentUser";
import { Box, Container, Tab, TabProps, Tabs } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Spinner from "../Spinner";
import PageHeader from "../pageHeader/PageHeader";
import { Person, Settings } from "@mui/icons-material";
import TabPanel from "./TabPanel";
import UserForm from "../forms/UserForm";
import AccountSettingsForm from "../forms/AccountSettingsForm";

export default function UserAccountPage() {
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const role = useSelector((state: RootState) => state.auth.role);
  const [value, setValue] = React.useState(0);
  const { freelancerProfile, clientProfile, loading } = useCurrentUser();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabProps: TabProps = {
    sx: { minHeight: 42, textTransform: "capitalize" },
    iconPosition: "start",
  };

  const user = role === "Client" ? clientProfile : freelancerProfile;

  const defaultValues = user
    ? {
        email: user.user.email,
        phone: user.user.phoneNumber,
        username: user.user.username,
        image: user.image,
        bio:user.bio
      }
    : undefined;

  if (loading || !user) return <Spinner />;

  return (
    <Container maxWidth="lg">
      <PageHeader title="User account" breadcrumbs={["User", "Account"]} />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              {...tabProps}
              icon={<Person />}
              label="General"
              {...a11yProps(0)}
            />
            <Tab
              {...tabProps}
              icon={<Settings />}
              label="Settings"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <UserForm defaultValues={defaultValues} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AccountSettingsForm defaultValues={defaultValues} />
        </TabPanel>
      </Box>
    </Container>
  );
}
