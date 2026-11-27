import { render, screen } from "@testing-library/react";

import { NavigationListItemNestedIcon } from "../../../../components/sidebar/navigation/styled/NavigationListItemNestedIcon";

it("renders its children with its styles", () => {
  render(
    <NavigationListItemNestedIcon data-testid="el">
      content
    </NavigationListItemNestedIcon>,
  );
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ minWidth: "36px" });
});
