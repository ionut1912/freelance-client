import { screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";

import { makeStore, profile, renderApp } from "../../../testUtils";

import UserMenu from "./UserMenu";

it("shows the email, closes and logs out", async () => {
  const store = makeStore({
    auth: { user: null, role: "Client", error: null },
  });
  renderApp(<UserMenu profile={profile() as never} />, { store });
  const trigger = screen.getByRole("button");
  const item = (name: string) => screen.getByRole("menuitem", { name });
  const closed = () =>
    waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());

  for (const name of ["Profile", "My account"]) {
    userEvent.click(trigger);
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    userEvent.click(item(name));
    await closed();
  }
  userEvent.click(trigger);
  userEvent.click(item("Logout"));
  expect(store.getState().auth.role).toBeNull();
});

it("stays logged in when the menu is dismissed with Escape", async () => {
  localStorage.setItem("jwt", "abc");
  const store = makeStore({
    auth: { user: null, role: "Client", error: null },
  });
  renderApp(<UserMenu profile={profile() as never} />, { store });

  userEvent.click(screen.getByRole("button"));
  userEvent.keyboard("{esc}");

  await waitFor(() =>
    expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
  );
  expect(store.getState().auth.role).toBe("Client");
  expect(localStorage.getItem("jwt")).toBe("abc");
  localStorage.clear();
});

it.each(["Profile", "My account"])("opens the account page from %s", (name) => {
  renderApp(<UserMenu profile={profile() as never} />);

  userEvent.click(screen.getByRole("button"));
  userEvent.click(screen.getByRole("menuitem", { name }));

  expect(screen.getByTestId("path")).toHaveTextContent("/user-profile");
});
