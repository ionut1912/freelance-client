import { screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";
import UserAccountPage from "../../components/userProfile/UserAccountPage";
import {
  fakeApi,
  makeStore,
  profile,
  profileState,
  renderApp,
} from "../../testUtils";

jest.mock("../../components/forms/UserForm", () => () => <p>user form</p>);
jest.mock("../../components/forms/AccountSettingsForm", () => () => (
  <p>settings form</p>
));
jest.mock(
  "../../components/forms/AddressForm",
  () =>
    ({ onSubmit }: { onSubmit: (v: object) => void }) => (
      <button
        type="button"
        onClick={() => onSubmit({ addressCountry: "RO", addressCity: "Cluj" })}
      >
        save address
      </button>
    ),
);

const view = (role: "Client" | "Freelancer", state: object = {}) =>
  renderApp(<UserAccountPage />, {
    store: makeStore({
      auth: { user: null, role, error: null },
      userProfile: profileState(state) as never,
    }),
  });

it.each([1, 0])("switches tabs and updates address %i", async (id) => {
  const current = profile({ address: { ...profile().address, id } });
  const calls = fakeApi({ "GET current": [200, current] });
  view("Client", { clientProfiles: [current] });

  expect(screen.getByText("user form")).toBeInTheDocument();
  userEvent.click(screen.getByRole("tab", { name: "Settings" }));
  expect(screen.getByText("settings form")).toBeInTheDocument();
  userEvent.click(screen.getByRole("tab", { name: "Address" }));
  userEvent.click(screen.getByRole("button", { name: "save address" }));

  await waitFor(() =>
    expect(calls.find((c) => c.url.includes("address/7"))?.data).toMatchObject({
      id,
      country: "RO",
      city: "Cluj",
    }),
  );
});

it("shows a spinner without a profile", () => {
  fakeApi({ "GET current": [500] });
  view("Freelancer", { freelancerProfiles: [] });
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

it("opens the settings of an incomplete profile", () => {
  fakeApi({ "GET current": [500] });
  const incomplete = profile({
    bio: "",
    image: "",
    user: { id: 3, username: "", email: "", phoneNumber: "" },
  });
  view("Client", { clientProfiles: [incomplete] });
  userEvent.click(screen.getByRole("tab", { name: "Settings" }));
  expect(screen.getByText("settings form")).toBeInTheDocument();
});
