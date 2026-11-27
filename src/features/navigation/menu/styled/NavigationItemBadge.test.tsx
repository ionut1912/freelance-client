import { render, screen } from "@testing-library/react";

import { NavigationItemBadge } from "./NavigationItemBadge";

it("shows the badge content inline", () => {
  render(<NavigationItemBadge badgeContent="9" />);
  expect(screen.getByText("9")).toHaveStyle({ display: "flex" });
});
