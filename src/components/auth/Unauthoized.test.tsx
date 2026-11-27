import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import Unauthorized from "./Unauthoized";

const setup = (state?: unknown) => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/unauthorized", state }]}>
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<h1>login page</h1>} />
        <Route path="/register" element={<h1>register page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
  return userEvent.setup();
};
const link = (name: string) => screen.getByRole("link", { name });

describe("<Unauthorized />", () => {
  it.each([
    ["Go to Login", "login page"],
    ["Create one", "register page"],
  ])("follows '%s'", async (name, heading) => {
    const user = setup();

    await user.click(link(name));

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("links back to where the visitor came from", () => {
    setup({ from: { pathname: "/calendar" } });

    expect(link("Back")).toHaveAttribute("href", "/calendar");
  });

  it.each([undefined, null, {}, { from: {} }])(
    "links back home for the state %p",
    (state) => {
      setup(state);

      expect(link("Back")).toHaveAttribute("href", "/");
    },
  );
});
