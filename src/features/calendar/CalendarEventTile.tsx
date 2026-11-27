import { Box, Typography } from "@mui/material";

import { describeEventOnDay } from "./eventUtils";

interface CalendarEventTileProps {
  event: {
    id: string;
    name: string;
    startDate: string | Date;
    endDate: string | Date;
  };
  date: Date;
  isHover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CalendarEventTile = ({
  event,
  date,
  isHover,
  onMouseEnter,
  onMouseLeave,
}: CalendarEventTileProps) => {
  const { isMultiDayEvent, isFirstDay, isLastDay, showEventName, eventTime } =
    describeEventOnDay(event, date);

  const getBorderRadius = () => {
    if (isFirstDay) {
      return "4px 0 0 4px";
    }
    if (isLastDay) {
      return "0 4px 4px 0";
    }
    if (isMultiDayEvent) {
      return "0";
    }
    return "4px";
  };

  const getBackgroundColor = () => {
    if (isHover && isMultiDayEvent) {
      return "primary.dark";
    }
    if (isHover) {
      return "grey.200";
    }
    return undefined;
  };

  return (
    <Box
      className="react-calendar__tile-content"
      data-id={event.id}
      sx={{
        position: "relative",
        mb: 0.5,
        pl: !isMultiDayEvent ? 2 : 0.5,
        backgroundColor: isMultiDayEvent ? "primary.main" : "transparent",
        color: isMultiDayEvent ? "primary.contrastText" : "text.primary",
        borderRadius: getBorderRadius(),
        cursor: "pointer",
        transition: "all 0.1s ease-in-out",
        // The day is the focusable button; events cannot be nested controls.
        ".react-calendar__tile:focus-visible &": {
          backgroundColor: isMultiDayEvent ? "primary.dark" : "grey.200",
        },
        ...(isHover && {
          backgroundColor:
            getBackgroundColor() ??
            (isMultiDayEvent ? "primary.dark" : "grey.200"),
        }),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!isMultiDayEvent && (
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            position: "absolute",
            top: "50%",
            left: 8,
            content: '""',
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <Typography
        fontSize={12}
        textAlign="left"
        title={event.name}
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {!isMultiDayEvent && (
          <Typography component="span" fontSize="inherit">
            {eventTime}{" "}
          </Typography>
        )}
        <Typography
          component="span"
          fontSize="inherit"
          fontWeight="fontWeightMedium"
        >
          {showEventName ? event.name : <>&nbsp;</>}
        </Typography>
      </Typography>
    </Box>
  );
};

export default CalendarEventTile;
