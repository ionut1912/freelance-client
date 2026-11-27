import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Spinner from "../../../components/ui/Spinner";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import type { AddressData, UserData } from "../../../models/UserProfile";
import { routesLinks } from "../../../routes/index";
import type { AppDispatch, RootState } from "../../../store";
import { saveClientProfile } from "../../../store/user-profile/thunks";
import VerifyPhoto from "../../camera/VerifyPhoto";
import Dashboard from "../../dashboard/Dashboard";
import AddressForm from "../AddressForm";

import ProfileLoadError from "./ProfileLoadError";
import UserDataForm from "./UserDataForm";

const ClientPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const profile = useCurrentUser().clientProfile;
  const loading = useSelector((state: RootState) => state.userProfile.loading);
  const steps = ["Address Details", "User Details"];
  const [activeStep, setActiveStep] = useState(0);
  const [addressData, setAddressData] = useState<AddressData>({
    addressCountry: "",
    addressCity: "",
    addressStreet: "",
    addressStreetNumber: "",
    addressZip: "",
  });
  const [userData, setUserData] = useState<UserData>({ bio: "", image: "" });

  const loadFailed = useSelector(
    (state: RootState) => state.userProfile.loadFailed,
  );

  if (loading) {
    return <Spinner />;
  }
  if (loadFailed && !profile) {
    return <ProfileLoadError />;
  }

  if (profile) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        {profile.isVerified ? <Dashboard /> : <VerifyPhoto profile={profile} />}
      </Box>
    );
  }

  let content: React.ReactNode = null;

  if (activeStep === 0) {
    content = (
      <AddressForm
        key="step-0"
        initialValues={addressData}
        onSubmit={(vals) => {
          setAddressData(vals);
          setActiveStep(1);
        }}
      />
    );
  } else if (activeStep === 1) {
    content = (
      <UserDataForm
        key="step-1"
        initialValues={userData}
        onSubmit={async (vals) => {
          setUserData(vals);
          await dispatch(
            saveClientProfile({
              address: addressData,
              user: vals,
            }),
          );
          void navigate(routesLinks.client);
        }}
      />
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        {content}
        <Box sx={{ mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => s - 1)}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default ClientPage;
