import { Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { isAuthenticated } from "../../lib/auth";
import { routesLinks } from "../../routes/index";
import type { RootState } from "../../store";
import { navigateByRole } from "../../utils/authUtils";
import FullPageMessage from "../ui/FullPageMessage";

const NotFound = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.role);
  const handleReturnHome = () => {
    if (!isAuthenticated()) {
      void navigate(routesLinks.home);
    } else {
      navigateByRole(role, navigate);
    }
  };
  return (
    <FullPageMessage>
      <div className="text-9xl font-bold text-primary-600">404</div>
      <Typography variant="h4" className="text-gray-700">
        Page Not Found
      </Typography>
      <Typography variant="body1" className="text-gray-500 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleReturnHome}
        className="mt-8"
      >
        Return Home
      </Button>
    </FullPageMessage>
  );
};

export default NotFound;
