import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../components/forms/LoginForm";
import { fakeApi, renderApp } from "../../testUtils";

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const blur = (label: string) => fireEvent.blur(screen.getByLabelText(label));
const button = (name: string) => screen.getByRole("button", { name });

it("validates and submits the credentials", async () => {
  const calls = fakeApi({ "POST auth/login": [401, { detail: "No" }] });
  renderApp(<LoginForm />);
  expect(button("Log In")).toBeDisabled();

  blur("Username");
  blur("Password");
  expect(await screen.findByText("Username is required")).toBeInTheDocument();

  type("Username", "ana");
  type("Password", "secret1");
  await waitFor(() => expect(button("Log In")).toBeEnabled());
  userEvent.click(button("Log In"));

  await waitFor(() =>
    expect(calls[0]?.data).toEqual({ username: "ana", password: "secret1" }),
  );
});

const submit = async (username: string, password: string) => {
  type("Username", username);
  type("Password", password);
  await waitFor(() => expect(button("Log In")).toBeEnabled());
  userEvent.click(button("Log In"));
};

it.each([
  ["username", "", "secret1"],
  ["password", "ana", ""],
])("is disabled without a %s", async (_field, username, password) => {
  renderApp(<LoginForm />);
  type("Username", "x");
  type("Password", "x");
  await waitFor(() => expect(button("Log In")).toBeEnabled());

  type("Username", username);
  type("Password", password);

  await waitFor(() => expect(button("Log In")).toBeDisabled());
});

it("stores the token and opens the role's page on success", async () => {
  const claims = {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Client",
  };
  const token = `h.${btoa(JSON.stringify(claims))}.s`;
  fakeApi({ "POST auth/login": [200, { token }] });
  const { store } = renderApp(<LoginForm />);

  await submit("ana", "secret1");

  await waitFor(() =>
    expect(screen.getByTestId("path")).toHaveTextContent("/client"),
  );
  expect(localStorage.getItem("jwt")).toBe(token);
  expect(store.getState().auth.role).toBe("Client");
  localStorage.clear();
});

it("stays on the page and stores nothing when rejected", async () => {
  fakeApi({ "POST auth/login": [401, { detail: "No" }] });
  const { store } = renderApp(<LoginForm />, { path: "/login" });

  await submit("ana", "wrong-password");

  await waitFor(() => expect(store.getState().auth.error).not.toBeNull());
  expect(screen.getByTestId("path")).toHaveTextContent("/login");
  expect(localStorage.getItem("jwt")).toBeNull();
});
