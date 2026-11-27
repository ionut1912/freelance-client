import { render, screen } from "@testing-library/react";

import { UserMenuMenuItemWithSeparator } from "./UserMenuMenuItemWithSeparator";

it("renders its children with its styles", () => {
  render(
    <UserMenuMenuItemWithSeparator data-testid="el">
      content
    </UserMenuMenuItemWithSeparator>,
  );
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ position: "relative", marginTop: "16px" });
});
