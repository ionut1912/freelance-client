import React from "react";
import { Alert, Button, Container, Typography } from "@mui/material";
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { routesLinks } from "../../routes/index";

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  if (isRouteErrorResponse(error)) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <Alert severity="error" className="mb-4">
            {error.status} - {error.statusText}
          </Alert>
          <Typography variant="h5" className="text-gray-700">
            {typeof error.data === "object" &&
            error.data !== null &&
            "message" in error.data
              ? ((error.data as { message?: string }).message ??
                "Something went wrong")
              : "Something went wrong"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(routesLinks.home)}
            className="mt-4"
          >
            Go Back Home
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <Alert severity="error" className="mb-4">
          Unexpected Error
        </Alert>
        <Typography variant="h5" className="text-gray-700">
          Something went wrong. Please try again later.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(routesLinks.home)}
          className="mt-4"
        >
          Go Back Home
        </Button>
      </div>
    </Container>
  );
};
export default ErrorBoundary;
