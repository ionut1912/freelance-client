import { Container } from "@mui/material";
import type { ReactNode } from "react";

/** Centres a short message and its actions on an otherwise empty screen. */
const FullPageMessage = ({ children }: { children: ReactNode }) => (
  <Container className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-6">{children}</div>
  </Container>
);

export default FullPageMessage;
