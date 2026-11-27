import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import CalendarPage from "./CalendarPage";

const day = (n: number, hour = 10) => new Date(2030, 0, n, hour);
const mockData = [1, 2, 3].map((n) => ({
  date: day(n),
  events: [
    { id: "long", name: "Conference", startDate: day(1), endDate: day(3) },
    { id: "short", name: "Standup", startDate: day(n), endDate: day(n, 11) },
  ],
}));
jest.mock("./useCalendar", () => ({
  useCalendar: () => ({ data: mockData }),
}));

// Render the tiles for known days instead of the current month.
jest.mock("react-calendar", () => ({
  __esModule: true,
  default: ({
    tileContent,
  }: {
    tileContent: (a: { date: Date; view: string }) => ReactNode;
  }) => (
    <>
      {[1, 2, 3, 9].map((n) => (
        <div key={n} data-testid={`day-${n}`}>
          {tileContent({ date: new Date(2030, 0, n), view: "month" })}
        </div>
      ))}
      <div data-testid="week">
        {tileContent({ date: new Date(2030, 0, 1), view: "week" })}
      </div>
    </>
  ),
}));

it("names a multi-day event on its first day only", () => {
  render(<CalendarPage />);
  expect(screen.getByTestId("day-1")).toHaveTextContent("Conference");
  expect(screen.getByTestId("day-2")).not.toHaveTextContent("Conference");
  expect(screen.getByTestId("day-3")).toHaveTextContent("Standup");
});

it("shows nothing without events or outside the month view", () => {
  render(<CalendarPage />);
  expect(screen.getByTestId("day-9")).toBeEmptyDOMElement();
  expect(screen.getByTestId("week")).toBeEmptyDOMElement();
});

it("survives hovering every event", () => {
  render(<CalendarPage />);
  const tiles = () =>
    document.querySelectorAll(".react-calendar__tile-content");
  const total = tiles().length;
  tiles().forEach((tile) => {
    fireEvent.mouseEnter(tile);
    fireEvent.mouseLeave(tile);
  });
  fireEvent.mouseEnter(tiles()[0]);
  fireEvent.mouseEnter(tiles()[1]);
  expect(tiles()).toHaveLength(total);
});
