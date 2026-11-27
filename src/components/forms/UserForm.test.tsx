import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserForm from "../../components/forms/UserForm";
import {
  fakeApi,
  makeStore,
  profile,
  profileState,
  renderApp,
} from "../../testUtils";

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const blur = (label: string) => fireEvent.blur(screen.getByLabelText(label));
const button = (name: string) => screen.getByRole("button", { name });

const storeFor = (state: object = {}) =>
  makeStore({
    auth: { user: null, role: "Client", error: null },
    userProfile: profileState(state) as never,
  });
const fileInput = () =>
  document.querySelector("#upload-input") as HTMLInputElement;
const upload = (...files: File[]) =>
  fireEvent.change(fileInput(), { target: { files } });
const png = new File(["x"], "a.png", { type: "image/png" });
const ready = async () => {
  // A failing reload keeps the preloaded profile, so it cannot reset the form
  // while a test is typing.
  const calls = fakeApi({ "GET current": [500] });
  renderApp(<UserForm />, { store: storeFor() });
  await waitFor(() =>
    expect(screen.getByLabelText("Username")).toHaveValue("ana"),
  );
  return calls;
};
const patches = (calls: { method: string }[]) =>
  calls.filter((c) => c.method === "PATCH");

beforeEach(() => {
  window.alert = jest.fn();
});

it("saves account details", async () => {
  const calls = await ready();
  type("Username", "ana2");
  userEvent.click(button("Save changes"));
  await waitFor(() =>
    expect(calls.find((c) => c.url.endsWith("userData"))?.data).toMatchObject({
      username: "ana2",
    }),
  );
});

it("shows validation errors", async () => {
  await ready();
  for (const label of ["Username", "Email", "Phone Number", "Bio"]) {
    type(label, "");
    blur(label);
  }
  expect(await screen.findByText("Username is required")).toBeInTheDocument();
  expect(screen.getByText("Email is required")).toBeInTheDocument();
  expect(screen.getByText("Bio is required")).toBeInTheDocument();
});

it("uploads and removes the picture", async () => {
  const calls = await ready();
  upload(png);
  await waitFor(() => expect(patches(calls)).toHaveLength(1));

  userEvent.click(button("Remove picture"));
  userEvent.click(button("No"));
  await waitFor(() => expect(screen.queryByText("Yes")).toBeNull());
  userEvent.click(button("Remove picture"));
  userEvent.keyboard("{esc}");
  await waitFor(() => expect(screen.queryByText("Yes")).toBeNull());
  userEvent.click(button("Remove picture"));
  userEvent.click(button("Yes"));
  await waitFor(() => expect(patches(calls)).toHaveLength(2));
});

it("rejects wrong file types and large files", async () => {
  const calls = await ready();
  const big = new File(["x"], "b.png", { type: "image/png" });
  Object.defineProperty(big, "size", { value: 6 * 1024 * 1024 });

  upload(new File(["x"], "a.gif", { type: "image/gif" }));
  upload(big);
  upload();

  expect(window.alert).toHaveBeenCalledTimes(2);
  expect(patches(calls)).toHaveLength(0);
});

it("shows loading and empty states", () => {
  // A failing request leaves the preloaded state untouched.
  fakeApi({ "GET current": [500] });
  renderApp(<UserForm />, { store: storeFor({ loading: true }) });
  expect(screen.getByText("Loading user data...")).toBeInTheDocument();

  renderApp(<UserForm />, { store: storeFor({ clientProfiles: [] }) });
  expect(screen.getByText("No user profile found.")).toBeInTheDocument();
});

it("shows empty fields for an incomplete profile", () => {
  fakeApi({ "GET current": [500] });
  const incomplete = profile({
    bio: "",
    image: "",
    user: { id: 3, username: "", email: "", phoneNumber: "" },
  });
  renderApp(<UserForm />, {
    store: storeFor({ clientProfiles: [incomplete] }),
  });
  for (const label of ["Username", "Email", "Phone Number", "Bio"]) {
    expect(screen.getByLabelText(label)).toHaveValue("");
  }
});
