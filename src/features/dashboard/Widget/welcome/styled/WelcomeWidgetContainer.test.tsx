import { render, screen } from "@testing-library/react";

import { WelcomeWidgetContainer } from "./WelcomeWidgetContainer";

it("renders its children with its styles", () => {
  render(
    <WelcomeWidgetContainer data-testid="el">content</WelcomeWidgetContainer>,
  );
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ display: "flex", minHeight: "235px" });
});
