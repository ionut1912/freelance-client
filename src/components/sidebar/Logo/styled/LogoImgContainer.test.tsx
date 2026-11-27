import { render, screen } from "@testing-library/react";
import { LogoImgContainer } from "../../../../components/sidebar/Logo/styled/LogoImgContainer";

it("inverts the image only when asked", () => {
  render(
    <>
      <LogoImgContainer invertImage data-testid="inverted" />
      <LogoImgContainer data-testid="plain" />
    </>,
  );
  expect(screen.getByTestId("inverted")).toHaveStyle({ filter: "invert(1)" });
  expect(screen.getByTestId("plain")).toHaveStyle({ filter: "invert(0)" });
});
