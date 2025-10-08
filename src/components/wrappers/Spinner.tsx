import React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Spinner() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <CircularProgress size={48} thickness={4} />
    </Box>
  );
}
