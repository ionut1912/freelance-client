import { Alert, Button, Container } from "@mui/material";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store";
import { loadCurrentUserProfile } from "../../store/user-profile/thunks";

const ProfileLoadError = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            onClick={() => void dispatch(loadCurrentUserProfile())}
          >
            Retry
          </Button>
        }
      >
        We could not load your profile.
      </Alert>
    </Container>
  );
};

export default ProfileLoadError;
