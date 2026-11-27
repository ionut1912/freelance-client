import { render, screen } from "@testing-library/react";

import { WidgetTitleContainer } from "../../../../components/dashboard/Widget/stylled/WidgetTitleContainer";

it("renders its children with its styles", () => {
  render(<WidgetTitleContainer data-testid="el">content</WidgetTitleContainer>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ marginBottom: "16px" });
});
