import { render, screen } from "@testing-library/react";

import { UserMenuInfo } from "../../../../components/sidebar/user-menu/styled/UserMenuInfo";

it("renders its children with its styles", () => {
  render(<UserMenuInfo data-testid="el">content</UserMenuInfo>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ marginBottom: "8px" });
});
