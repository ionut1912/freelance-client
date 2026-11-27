import { Alert, Button, Typography } from "@mui/material";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";

import { routesLinks } from "../../routes/index";
import FullPageMessage from "../ui/FullPageMessage";

const describeError = (error: unknown) => {
  if (!isRouteErrorResponse(error)) {
    return {
      title: "Unexpected Error",
      message: "Something went wrong. Please try again later.",
    };
  }
  const data: unknown = error.data;
  return {
    title: `${error.status} - ${error.statusText}`,
    message:
      (typeof data === "object" && data !== null && "message" in data
        ? (data as { message?: string }).message
        : undefined) ?? "Something went wrong",
  };
};

const ErrorBoundary = () => {
  const { title, message } = describeError(useRouteError());
  const navigate = useNavigate();

  return (
    <FullPageMessage>
      <Alert severity="error" className="mb-4">
        {title}
      </Alert>
      <Typography variant="h5" className="text-gray-700">
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(routesLinks.home)}
        className="mt-4"
      >
        Go Back Home
      </Button>
    </FullPageMessage>
  );
};
export default ErrorBoundary;
