import { render, screen } from "@testing-library/react";
import SalesWidget from "../../../../components/dashboard/Widget/sales/SalesWidget";

jest.mock("@nivo/geo", () => ({
  ResponsiveChoropleth: ({ data }: { data: unknown[] }) => (
    <p>{data.length} countries</p>
  ),
}));

it("plots the sales data on a map", () => {
  render(<SalesWidget />);
  expect(screen.getByText("Sales summary")).toBeInTheDocument();
  expect(screen.getByText(/[1-9]\d* countries/)).toBeInTheDocument();
});
