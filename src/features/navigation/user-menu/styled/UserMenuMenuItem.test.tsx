import { render, screen } from "@testing-library/react";

import { UserMenuMenuItem } from "./UserMenuMenuItem";

it("renders its children with its styles", () => {
  render(<UserMenuMenuItem data-testid="el">content</UserMenuMenuItem>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ minWidth: "160px" });
});
