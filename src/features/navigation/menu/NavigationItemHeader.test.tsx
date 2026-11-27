import { render, screen } from "@testing-library/react";

import NavigationItemHeader from "./NavigationItemHeader";

it("shows the section header", () => {
  render(<NavigationItemHeader header="Apps" />);
  expect(screen.getByText("Apps")).toBeInTheDocument();
});
