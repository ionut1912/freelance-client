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

it("is a link that can be reached by keyboard", () => {
  renderApp(<Logo role="Client" />);

  userEvent.tab();

  const link = screen.getByRole("link", { name: "FreelanceHub" });
  expect(link).toHaveFocus();
  expect(link).toHaveAttribute("href", "/client");
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
});
