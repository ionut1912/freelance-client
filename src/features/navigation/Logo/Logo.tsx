import { Box } from "@mui/material";
import { Link } from "react-router";

import type { UserRole } from "../../../models/UserProfile";
import { pathByRole } from "../../../utils/authUtils";

import { LogoImg } from "./styled/LogoImg";
import { LogoImgContainer } from "./styled/LogoImgContainer";
import { LogoText } from "./styled/LogoText";

interface Params {
  invertImage?: boolean;
  role: UserRole;
}

export const Logo = ({ invertImage, role }: Params) => {
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
      component={Link}
      to={pathByRole(role)}
    >
      <LogoImgContainer invertImage={invertImage}>
        <LogoImg component="img" src="/assets/logo.png" alt="" />
      </LogoImgContainer>
      <LogoText component="span">FreelanceHub</LogoText>
    </Box>
  );
};
