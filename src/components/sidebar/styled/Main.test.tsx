import { render, screen } from "@testing-library/react";

import { Main } from "../../../components/sidebar/styled/Main";

it("shifts right only while the sidebar is open", () => {
  render(
    <>
      <Main open data-testid="open" />
      <Main data-testid="closed" />
    </>,
  );
  expect(screen.getByTestId("open")).toHaveStyle({ marginLeft: "280px" });
  expect(screen.getByTestId("closed")).toHaveStyle({ marginLeft: "0px" });
});
