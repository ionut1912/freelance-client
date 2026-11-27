import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { UserRole } from "../../../models/UserProfile";
import { navigateByRole } from "../../../utils/authUtils";

import { LogoImg } from "./styled/LogoImg";
import { LogoImgContainer } from "./styled/LogoImgContainer";
import { LogoText } from "./styled/LogoText";

interface Params {
  invertImage?: boolean;
  role: UserRole;
}

export const Logo = ({ invertImage, role }: Params) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        cursor: "pointer",
        "&:hover": { opacity: 0.8 },
      }}
      onClick={() => navigateByRole(role, navigate)}
      component="a"
    >
      <LogoImgContainer invertImage={invertImage}>
        <LogoImg component="img" src="/assets/logo.png" alt="" />
      </LogoImgContainer>
      <LogoText component="h1">FreelanceHub</LogoText>
    </Box>
  );
};
