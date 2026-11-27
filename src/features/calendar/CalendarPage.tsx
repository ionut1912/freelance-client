import { Container } from "@mui/material";
import { useState } from "react";
import ReactCalendar from "react-calendar";

import CalendarEventTile from "./CalendarEventTile";
import { compareEvents, isSameDay } from "./eventUtils";
import { CalendarStyles } from "./styles/styles";
import { useCalendar } from "./useCalendar";

const CalendarPage = () => {
  const { data } = useCalendar();
  const [hoveredEvent, setHoveredEvent] = useState<string>("");
  const [today] = useState(() => new Date());

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const events = data.find((data) => isSameDay(date, new Date(data.date)));

      if (events?.events) {
        return events.events
          .sort(compareEvents)
          .map((event) => (
            <CalendarEventTile
              key={event.id}
              event={event}
              date={date}
              isHover={hoveredEvent === event.id}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent("")}
            />
          ));
      }
    }

    return;
  };

  return (
    <Container>
      <CalendarStyles>
        <ReactCalendar tileContent={tileContent} value={today} />
      </CalendarStyles>
    </Container>
  );
};

export default CalendarPage;
