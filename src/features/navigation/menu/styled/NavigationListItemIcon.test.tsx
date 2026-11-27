import { render, screen } from "@testing-library/react";

import { NavigationListItemIcon } from "./NavigationListItemIcon";

it("renders its children with its styles", () => {
  render(
    <NavigationListItemIcon data-testid="el">content</NavigationListItemIcon>,
  );
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ minWidth: "36px" });
});
