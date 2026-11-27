import { render, screen } from "@testing-library/react";

import { LogoText } from "./LogoText";

it("renders its children with its styles", () => {
  render(<LogoText data-testid="el">content</LogoText>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ fontSize: "1.5rem" });
});
