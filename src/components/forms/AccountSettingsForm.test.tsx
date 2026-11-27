import { screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";

import AccountSettingsForm from "../../components/forms/AccountSettingsForm";
import { fakeApi, renderApp } from "../../testUtils";

const button = (name: string) => screen.getByRole("button", { name });
const closed = () =>
  waitFor(() => expect(screen.queryByText("Yes")).not.toBeInTheDocument());

it("toggles settings, saves and deletes the account", async () => {
  const calls = fakeApi();
  renderApp(<AccountSettingsForm defaultValues={{ bio: "My bio" } as never} />);
  expect(screen.getByText("My bio")).toBeInTheDocument();

  const sms = screen.getByLabelText("Enable SMS notifications");
  userEvent.click(sms);
  expect(sms).toBeChecked();
  userEvent.click(button("Save changes"));

  userEvent.click(button("Delete account"));
  userEvent.click(button("No"));
  await closed();
  userEvent.click(button("Delete account"));
  userEvent.keyboard("{esc}");
  await closed();
  userEvent.click(button("Delete account"));
  userEvent.click(button("Yes"));
  await waitFor(() => expect(calls[0]?.method).toBe("DELETE"));
  await closed();
});

it("renders the default settings without a profile", () => {
  renderApp(<AccountSettingsForm />);

  expect(screen.getByLabelText("Enable email notifications")).toBeChecked();
  expect(screen.getByLabelText("Enable SMS notifications")).not.toBeChecked();
  expect(screen.queryByText("Yes")).not.toBeInTheDocument();
});

it("does not call the server when deletion is cancelled", async () => {
  const calls = fakeApi();
  renderApp(<AccountSettingsForm />);

  userEvent.click(button("Delete account"));
  userEvent.click(button("No"));
  await closed();

  expect(calls).toHaveLength(0);
});

it("stays on the page when deletion fails", async () => {
  fakeApi({ "DELETE auth/account": [500, { detail: "Boom" }] });
  const { store } = renderApp(<AccountSettingsForm />, { path: "/settings" });

  userEvent.click(button("Delete account"));
  userEvent.click(button("Yes"));
  await closed();

  expect(store.getState().auth.error).not.toBeNull();
  expect(screen.getByTestId("path")).toHaveTextContent("/settings");
});

it("removes the token after deleting the account", async () => {
  localStorage.setItem("jwt", "abc");
  fakeApi();
  renderApp(<AccountSettingsForm />);

  userEvent.click(button("Delete account"));
  userEvent.click(button("Yes"));
  await closed();

  const token = localStorage.getItem("jwt");
  localStorage.clear();
  expect(token).toBeNull();
});
