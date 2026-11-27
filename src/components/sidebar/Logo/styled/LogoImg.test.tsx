import { createTheme, ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { LogoImg } from "../../../../components/sidebar/Logo/styled/LogoImg";

it("renders its children with its styles", () => {
  render(<LogoImg data-testid="el">content</LogoImg>);
  const element = screen.getByTestId("el");
  expect(element).toHaveTextContent("content");
  expect(element).toHaveStyle({ maxWidth: "40px" });
});

it.each([
  ["light", "invert(0)"],
  ["dark", "invert(1)"],
] as const)("adapts the image to the %s theme", (mode, filter) => {
  render(
    <ThemeProvider theme={createTheme({ palette: { mode } })}>
      <LogoImg data-testid="el" />
    </ThemeProvider>,
  );
  expect(screen.getByTestId("el")).toHaveStyle({ filter });
});
