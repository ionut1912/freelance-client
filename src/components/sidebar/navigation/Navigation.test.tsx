import { screen } from "@testing-library/react";
import userEvent from "user-event-13";

import Navigation from "../../../components/sidebar/navigation/Navigation";
import { renderApp } from "../../../testUtils";

const groups = ["Profile", "Project", "Finance"];

it.each([
  ["Client", "Freelancers", "My Freelancers"],
  ["Freelancer", "Clients", "My Clients"],
] as const)("shows the %s menu", (role, group, child) => {
  renderApp(<Navigation role={role} />);
  for (const label of [...groups, group]) {
    userEvent.click(screen.getByText(label, { selector: "span" }));
  }
  expect(screen.getByText(child)).toBeInTheDocument();
  expect(screen.getByText("My Invoices")).toBeInTheDocument();
  expect(screen.getByText("Calendar")).toBeInTheDocument();
});

it.each([
  ["Client", "Clients"],
  ["Freelancer", "Freelancers"],
] as const)("hides the other role's group from a %s", (role, group) => {
  renderApp(<Navigation role={role} />);

  expect(screen.queryByText(group)).not.toBeInTheDocument();
});

it("disables links to pages that do not exist yet", () => {
  renderApp(<Navigation role="Client" />);

  expect(
    screen.getByRole("button", { name: "Projects Boards" }),
  ).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("button", { name: "Calendar" })).not.toHaveAttribute(
    "aria-disabled",
  );
});
