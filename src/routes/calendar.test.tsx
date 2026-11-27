import { render, screen } from "@testing-library/react";
import Route from "../routes/calendar";

jest.mock("../components/calendar/CalendarPage", () => () => (
  <p>page content</p>
));

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
