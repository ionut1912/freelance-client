import { render, screen } from "@testing-library/react";

import UsersStatsWidget from "./UsersStatsWidget";

jest.mock("@nivo/bar", () => ({
  ResponsiveBar: ({
    barAriaLabel,
  }: {
    barAriaLabel: (e: object) => string;
  }) => <p>{barAriaLabel({ id: "a", formattedValue: 1, indexValue: "RO" })}</p>,
}));

it("labels each bar", () => {
  render(<UsersStatsWidget />);
  expect(screen.getByText("a: 1 in country: RO")).toBeInTheDocument();
});
