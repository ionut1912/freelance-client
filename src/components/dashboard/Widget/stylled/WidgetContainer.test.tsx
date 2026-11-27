import { render, screen } from "@testing-library/react";
import { WidgetContainer } from "../../../../components/dashboard/Widget/stylled/WidgetContainer";

it("renders its children with its styles", () => {
  render(<WidgetContainer data-testid="el">content</WidgetContainer>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ display: "flex", flexDirection: "column" });
});
