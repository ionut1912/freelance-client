import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Logo } from "../../../components/sidebar/Logo/Logo";
import { renderApp } from "../../../testUtils";

it.each([
  ["Client", "/client"],
  ["Freelancer", "/freelancer"],
] as const)("takes a %s home", (role, path) => {
  renderApp(<Logo role={role} invertImage />);
  userEvent.click(screen.getByText("FreelanceHub"));
  expect(screen.getByTestId("path")).toHaveTextContent(path);
});
