import { render, screen } from "@testing-library/react";

import { AppBar } from "../../../components/sidebar/styled/AppBar";

it("makes room for the sidebar only while open", () => {
  render(
    <>
      <AppBar open data-testid="open" />
      <AppBar data-testid="closed" />
    </>,
  );
  expect(screen.getByTestId("open")).toHaveStyle({ marginLeft: "280px" });
  expect(screen.getByTestId("closed")).not.toHaveStyle({
    marginLeft: "280px",
  });
  expect(screen.getByTestId("open")).not.toHaveAttribute("open");
});
