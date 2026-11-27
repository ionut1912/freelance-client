import { screen, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { buildToken } from "../../testUtils/factories";
import {
  held,
  malformed,
  offline,
  recordRequests,
  reply,
} from "../../testUtils/handlers";
import { renderWithProviders } from "../../testUtils/render";

const setup = () => renderWithProviders(<LoginForm />, { path: "/login" });
type User = ReturnType<typeof setup>["user"];

const username = () => screen.getByRole("textbox", { name: "Username" });
// Password inputs have no ARIA role.
const password = () => screen.getByLabelText("Password");
const submit = () => screen.getByRole("button", { name: "Log In" });
const path = () => screen.getByRole("status", { name: "current path" });

const fillIn = async (user: User, name = "ana", secret = "secret1") => {
  await user.type(username(), name);
  await user.type(password(), secret);
  await waitFor(() => expect(submit()).toBeEnabled());
};

describe("<LoginForm />", () => {
  it.each([
    ["Client", "/client"],
    ["Freelancer", "/freelancer"],
  ])("logs a %s in and opens %s", async (role, destination) => {
    const token = buildToken(role);
    reply("post", "auth/login", { token });
    const sent = recordRequests();
    const { user, store } = setup();

    await fillIn(user);
    await user.click(submit());

    await waitFor(() => expect(path()).toHaveTextContent(destination));
    await expect(sent[0]?.body()).resolves.toEqual({
      username: "ana",
      password: "secret1",
    });
    expect(localStorage.getItem("jwt")).toBe(token);
    expect(store.getState().auth.role).toBe(role);
  });

  it("sends unicode credentials unchanged", async () => {
    reply("post", "auth/login", { token: buildToken("Client") });
    const sent = recordRequests();
    const { user } = setup();

    await fillIn(user, "Ștefan 🚀", "părolă-ß");
    await user.click(submit());

    await waitFor(() => expect(sent).toHaveLength(1));
    await expect(sent[0]?.body()).resolves.toEqual({
      username: "Ștefan 🚀",
      password: "părolă-ß",
    });
  });

  it("shows required messages for fields left empty", async () => {
    const { user } = setup();

    await user.click(username());
    await user.tab();
    await user.click(password());
    await user.tab();

    expect(await screen.findByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(submit()).toBeDisabled();
  });

  it.each([400, 401, 403, 404, 500])(
    "shows the server message on HTTP %i and stays",
    async (status) => {
      reply("post", "auth/login", { detail: `Refused ${status}` }, status);
      const { user } = setup();

      await fillIn(user);
      await user.click(submit());

      expect(await screen.findByText(`Refused ${status}`)).toBeInTheDocument();
      expect(path()).toHaveTextContent("/login");
      expect(localStorage.getItem("jwt")).toBeNull();
    },
  );

  it("reports a network failure", async () => {
    offline("post", "auth/login");
    const { user } = setup();

    await fillIn(user);
    await user.click(submit());

    expect(await screen.findByText("Network Error")).toBeInTheDocument();
  });

  // Possible bug: a 200 whose body is not JSON is treated as a success.
  it("does not sign in when the response is not valid JSON", async () => {
    malformed("post", "auth/login");
    jest.spyOn(console, "error").mockImplementation(() => {});
    const sent = recordRequests();
    const { user, store } = setup();

    await fillIn(user);
    await user.click(submit());

    await waitFor(() => expect(sent).toHaveLength(1));
    await waitFor(() => expect(store.getState().auth.role).toBeFalsy());
  });

  it("sends one request for a double click", async () => {
    const release = held("post", "auth/login", {
      token: buildToken("Client"),
    });
    const sent = recordRequests();
    const { user } = setup();

    await fillIn(user);
    await user.dblClick(submit());
    release();

    await waitFor(() => expect(path()).toHaveTextContent("/client"));
    expect(sent).toHaveLength(1);
  });
});
