import { render, screen } from "@testing-library/react";

import { DrawerHeader } from "../../../components/sidebar/styled/DrawerHeader";

it("renders its children with its styles", () => {
  render(<DrawerHeader data-testid="el">content</DrawerHeader>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({
    display: "flex",
    justifyContent: "space-between",
  });
});
