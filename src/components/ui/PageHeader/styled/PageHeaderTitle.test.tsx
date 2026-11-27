import { render, screen } from "@testing-library/react";

import { PageHeaderTitle } from "./PageHeaderTitle";

it("renders its children with its styles", () => {
  render(<PageHeaderTitle data-testid="el">content</PageHeaderTitle>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ fontSize: "35px" });
});
