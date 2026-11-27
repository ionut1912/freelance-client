import { render, screen } from "@testing-library/react";

import { CalendarStyles } from "./styles";

it("styles the calendar it wraps", () => {
  render(
    <CalendarStyles>
      <div className="react-calendar">calendar</div>
    </CalendarStyles>,
  );
  expect(screen.getByText("calendar")).toHaveStyle({ width: "100%" });
});
