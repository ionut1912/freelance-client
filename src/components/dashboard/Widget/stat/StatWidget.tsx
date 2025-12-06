import React from "react";
import { Stack, Typography } from "@mui/material";
import Widget, { type WidgetProps } from "../Widget";

interface StatWidgetProps extends WidgetProps {
  value: string;
  footerText?: string;
}

const StatWidget = ({ title, value, footerText }: StatWidgetProps) => {
  return (
    <Widget title={title} sx={{ minHeight: "120px" }}>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Typography variant="h4" component="p" fontWeight="fontWeightBold">
          {value}
        </Typography>
        {footerText ? (
          <Typography variant="body2">{footerText}</Typography>
        ) : null}
      </Stack>
    </Widget>
  );
};
export default StatWidget;
