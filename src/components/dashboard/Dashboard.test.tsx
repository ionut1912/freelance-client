import { render, screen } from "@testing-library/react";
import Dashboard from "../../components/dashboard/Dashboard";

jest.mock("../../components/dashboard/Widget/sales/SalesWidget", () => () => (
  <p>sales widget</p>
));
jest.mock(
  "../../components/dashboard/Widget/user-stats/UsersStatsWidget",
  () => () => <p>users widget</p>,
);

it("lays out every widget", () => {
  render(<Dashboard />);
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
  expect(screen.getAllByText("Welcome")).toHaveLength(2);
  expect(screen.getByText("12 153")).toBeInTheDocument();
  expect(screen.getByText("sales widget")).toBeInTheDocument();
  expect(screen.getByText("users widget")).toBeInTheDocument();
});
