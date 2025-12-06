import React from "react";
import { Box, Container, Tab, Tabs, type TabProps } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import Spinner from "../wrappers/Spinner";
import PageHeader from "../PageHeader/PageHeader";
import { Business, Person, Settings } from "@mui/icons-material";
import TabPanel from "./TabPanel";
import UserForm from "../forms/UserForm";
import AccountSettingsForm from "../forms/AccountSettingsForm";
import AddressForm from "../forms/AddressForm";
import { useCurrentUser } from "../../hooks/useCurerentUser";
import type { AddressData } from "../../models/UserProfile";
import { patchUserProfileAddress } from "../../store/user-profile/thunks";

const UserAccountPage = () => {
  const dispatch = useDispatch<AppDispatch>();
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
        username: user.user.username || "",
        email: user.user.email || "",
        phone: user.user.phoneNumber || "",
        bio: user.bio || "",
        image: user.image || "",
      }
    : undefined;

  if (loading || !user) return <Spinner />;

  const handleAddressSubmit = async (addressValues: AddressData) => {
    const patchRequest = {
      profileId: user.id,
      address: {
        id: user.address.id || 0,
        country: addressValues.addressCountry,
        city: addressValues.addressCity,
        street: addressValues.addressStreet,
        streetNumber: addressValues.addressStreetNumber,
        zipCode: addressValues.addressZip,
      },
    };
    await dispatch(patchUserProfileAddress(patchRequest));
  };

  return (
    <Container maxWidth="lg">
      <PageHeader title="User account" breadcrumbs={["User", "Account"]} />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="account tabs">
            <Tab {...tabProps} icon={<Person />} label="General" />
            <Tab {...tabProps} icon={<Business />} label="Address" />
            <Tab {...tabProps} icon={<Settings />} label="Settings" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <UserForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AddressForm
            initialValues={{
              addressCountry: user.address.country,
              addressCity: user.address.city,
              addressStreet: user.address.street,
              addressStreetNumber: user.address.streetNumber,
              addressZip: user.address.zipCode,
            }}
            onSubmit={(values) => void handleAddressSubmit(values)}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AccountSettingsForm defaultValues={defaultValues} />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default UserAccountPage;
