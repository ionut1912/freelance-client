import userEvent from "user-event-13";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Unauthorized from "../../components/auth/Unauthoized";

it.each([
  [undefined, "/"],
  [{ from: { pathname: "/calendar" } }, "/calendar"],
])("links back to where the visitor came from", (state, back) => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/unauthorized", state }]}>
      <Unauthorized />
    </MemoryRouter>,
  );
  userEvent.tab();
  expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
    "href",
    back,
  );
  expect(screen.getByRole("link", { name: "Go to Login" })).toHaveAttribute(
    "href",
    "/login",
  );
});
