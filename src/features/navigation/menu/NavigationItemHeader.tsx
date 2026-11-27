import { ListSubheader } from "@mui/material";

interface NavigationItemHeaderProps {
  header: string;
}

const NavigationItemHeader = ({ header }: NavigationItemHeaderProps) => {
  return (
    <ListSubheader
      component="div"
      sx={{
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: "fontWeightBold",
        pl: 2.2,
        color: "text.secondary",
        backgroundColor: "transparent",
        position: "relative",
        letterSpacing: "1px",
      }}
    >
      {header}
    </ListSubheader>
  );
};

export default NavigationItemHeader;
