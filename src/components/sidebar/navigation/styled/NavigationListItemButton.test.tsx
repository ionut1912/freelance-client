import { render, screen } from "@testing-library/react";
import { NavigationListItemButton } from "../../../../components/sidebar/navigation/styled/NavigationListItemButton";

it("styles top-level and nested items differently", () => {
  render(
    <>
      <NavigationListItemButton active>top</NavigationListItemButton>
      <NavigationListItemButton nested>nested</NavigationListItemButton>
    </>,
  );
  const top = screen.getByRole("button", { name: "top" });
  expect(top).toHaveStyle({ minHeight: "55px" });
  expect(top).not.toHaveAttribute("active");
  expect(screen.getByRole("button", { name: "nested" })).not.toHaveStyle({
    minHeight: "55px",
  });
});
