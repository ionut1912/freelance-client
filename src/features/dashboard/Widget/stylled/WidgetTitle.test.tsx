import { render, screen } from "@testing-library/react";

import { WidgetTitle } from "./WidgetTitle";

it("renders its children with its styles", () => {
  render(<WidgetTitle data-testid="el">content</WidgetTitle>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ fontSize: "1.25rem" });
});
