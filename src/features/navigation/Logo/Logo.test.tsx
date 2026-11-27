import { screen } from "@testing-library/react";
import userEvent from "user-event-13";

import { renderApp } from "../../../testUtils";

import { Logo } from "./Logo";

it.each([
  ["Client", "/client"],
  ["Freelancer", "/freelancer"],
] as const)("takes a %s home", (role, path) => {
  renderApp(<Logo role={role} invertImage />);
  userEvent.click(screen.getByText("FreelanceHub"));
  expect(screen.getByTestId("path")).toHaveTextContent(path);
});
