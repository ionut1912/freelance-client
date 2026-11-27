import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserMenu from "../../../components/sidebar/user-menu/UserMenu";
import { makeStore, profile, renderApp } from "../../../testUtils";

it("shows the email, closes and logs out", async () => {
  const store = makeStore({
    auth: { user: null, role: "Client", error: null },
  });
  renderApp(<UserMenu profile={profile() as never} />, { store });
  const trigger = screen.getByRole("button");
  const item = (name: string) => screen.getByRole("menuitem", { name });
  const closed = () =>
    waitFor(() => expect(screen.queryByRole("menu")).toBeNull());

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

  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(store.getState().auth.role).toBe("Client");
  expect(localStorage.getItem("jwt")).toBe("abc");
  localStorage.clear();
});
