import { render, screen } from "@testing-library/react";

import { WidgetContainer } from "./WidgetContainer";

it("renders its children with its styles", () => {
  render(<WidgetContainer data-testid="el">content</WidgetContainer>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ display: "flex", flexDirection: "column" });
});
