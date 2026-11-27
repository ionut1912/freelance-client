import { render, screen } from "@testing-library/react";

import { UserMenuContainer } from "./UserMenuContainer";

it("renders its children and passes props through", () => {
  render(<UserMenuContainer data-testid="el">content</UserMenuContainer>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
});
