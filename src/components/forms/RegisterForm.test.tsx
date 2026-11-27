import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";

import RegisterForm from "../../components/forms/RegisterForm";
import { fakeApi, makeStore, renderApp } from "../../testUtils";

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const blur = (label: string) => fireEvent.blur(screen.getByLabelText(label));
const button = (name: string) => screen.getByRole("button", { name });

const submit = async () => {
  type("Email", "ana@example.com");
  type("Username", "ana");
  type("PhoneNumber", "0712345678");
  type("Password", "secret1");
  blur("Password");
  await waitFor(() => expect(button("Create Account")).toBeEnabled());
  userEvent.click(button("Create Account"));
};

it("registers with the selected role", async () => {
  const calls = fakeApi();
  const store = makeStore({
    auth: { user: null, role: "Client", error: null },
  });
  renderApp(<RegisterForm />, { store });
  await submit();
  await waitFor(() =>
    expect(screen.getByTestId("path")).toHaveTextContent("/login"),
  );
  expect(calls[0]?.data).toMatchObject({ role: "Client" });
});

it("shows field errors", async () => {
  fakeApi();
  renderApp(<RegisterForm />);
  for (const label of ["Email", "Username", "PhoneNumber", "Password"]) {
    blur(label);
  }
  expect(await screen.findByText("Email is required")).toBeInTheDocument();
  expect(screen.getByText("Password is required")).toBeInTheDocument();
});

it("sends nothing without a role and goes to role selection", async () => {
  const calls = fakeApi();
  renderApp(<RegisterForm />, { path: "/register" });
  await submit();
  await waitFor(() =>
    expect(screen.getByTestId("path")).toHaveTextContent("/"),
  );
  expect(calls).toHaveLength(0);
});

it("can be retried after a failed registration", async () => {
  fakeApi({ "POST auth/register": [400, { detail: "taken" }] });
  renderApp(<RegisterForm />, {
    store: makeStore({ auth: { user: null, role: "Client", error: null } }),
  });
  await submit();
  await waitFor(() => expect(button("Create Account")).toBeDisabled());
  await waitFor(() => expect(button("Create Account")).toBeEnabled(), {
    timeout: 1000,
  });
});
