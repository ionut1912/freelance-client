import { render, screen } from "@testing-library/react";

import { WelcomeWidgetContent } from "./WelcomeWidgetContent";

it("renders its children with its styles", () => {
  render(<WelcomeWidgetContent data-testid="el">content</WelcomeWidgetContent>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ flexDirection: "column" });
});
