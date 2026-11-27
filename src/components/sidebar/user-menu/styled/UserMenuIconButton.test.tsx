import { render, screen } from "@testing-library/react";
import { UserMenuIconButton } from "../../../../components/sidebar/user-menu/styled/UserMenuIconButton";

it("renders its children with its styles", () => {
  render(<UserMenuIconButton data-testid="el">content</UserMenuIconButton>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ width: "40px", height: "40px" });
});
