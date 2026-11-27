interface TimedEvent {
  startDate: string | Date;
  endDate: string | Date;
}

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const compareEvents = (a: TimedEvent, b: TimedEvent) =>
  new Date(a.startDate).getTime() - new Date(a.endDate).getTime() >
  new Date(b.startDate).getTime() - new Date(b.endDate).getTime()
    ? 1
    : -1;

/** How `event` should be drawn in the tile for `date`. */
export const describeEventOnDay = (event: TimedEvent, date: Date) => {
  const dateFromStart = new Date(event.startDate);
  const dateFromEnd = new Date(event.endDate);
  const isMultiDayEvent =
    dateFromEnd.getTime() - dateFromStart.getTime() >= 86400000;
  const isFirstDay =
    dateFromStart.getDate() === date.getDate() && isMultiDayEvent;
  const isLastDay = dateFromEnd.getDate() === date.getDate() && isMultiDayEvent;
  const showEventName = isFirstDay || !isMultiDayEvent;
  const eventTime = dateFromStart.toLocaleTimeString("en-US", {
    hour: "2-digit",
  });

  return {
    isMultiDayEvent,
    isFirstDay,
    isLastDay,
    showEventName,
    eventTime,
  };
};
