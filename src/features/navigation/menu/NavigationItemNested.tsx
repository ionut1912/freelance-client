import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemText, Stack, Typography } from "@mui/material";
import { useCallback } from "react";

import type { NavigationItemNestedType } from "../../../models/Ui";
import { useAppNavigation } from "../useAppNavigation";

import { listItemPrimaryTypographyProps } from "./constants/listItemProps";
import NavigationItemSimple from "./NavigationItemSimple";
import { NavigationListItemButton } from "./styled/NavigationListItemButton";
import { NavigationListItemIcon } from "./styled/NavigationListItemIcon";
interface Props {
  item: NavigationItemNestedType;
}

const NavigationItemNested = ({ item }: Props) => {
  const { getIsOpen, toggleNavigationId } = useAppNavigation();
  const isOpen = getIsOpen(item.label);

  const handleToggleOpen = useCallback(() => {
    toggleNavigationId(item.label);
  }, [item.label, toggleNavigationId]);

  const nestedItems = item.items.map((item) => {
    return (
      <NavigationItemSimple
        key={item.path}
        item={item}
        nested
        animateOn={isOpen}
      />
    );
  });

  return (
    <>
      <NavigationListItemButton
        onClick={handleToggleOpen}
        disabled={item.disabled}
      >
        <NavigationListItemIcon>{item.icon({})}</NavigationListItemIcon>
        <Stack flex={1}>
          <ListItemText
            primary={item.label}
            slotProps={{ primary: listItemPrimaryTypographyProps }}
            sx={{ margin: 0 }}
          />
          {item.description ? (
            <Typography variant="caption">{item.description}</Typography>
          ) : null}
        </Stack>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </NavigationListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div">{nestedItems}</List>
      </Collapse>
    </>
  );
};

export default NavigationItemNested;
