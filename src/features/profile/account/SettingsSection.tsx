import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

const leftColumnSx = { maxWidth: "200px", width: "100%" };

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <Stack direction="row" spacing={2}>
    <Stack spacing={2} paddingY={1} sx={leftColumnSx}>
      <Typography fontWeight="fontWeightMedium">{title}</Typography>
    </Stack>
    <Stack spacing={2}>{children}</Stack>
  </Stack>
);

export default SettingsSection;
