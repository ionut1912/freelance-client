import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientPage from "../../components/userProfile/ClientPage";
import {
  fakeApi,
  makeStore,
  profile,
  profileState,
  renderApp,
} from "../../testUtils";

jest.mock("../../components/dashboard/Dashboard", () => () => <p>dashboard</p>);
jest.mock("../../components/camera/VerifyPhoto", () => () => (
  <p>verify photo</p>
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
jest.mock(
  "../../components/forms/UserDataForm",
  () =>
    ({ onSubmit }: { onSubmit: (v: object) => void }) => (
      <button type="button" onClick={() => onSubmit({ bio: "b" })}>
        save user
      </button>
    ),
);

const click = async (name: string) =>
  userEvent.click(await screen.findByRole("button", { name }));
const view = (state: object = {}) => {
  // A failing profile load keeps the preloaded state.
  const calls = fakeApi({ "GET current": [500] });
  renderApp(<ClientPage />, {
    store: makeStore({
      auth: { user: null, role: "Client", error: null },
      userProfile: profileState(state) as never,
    }),
  });
  return calls;
};

it("walks through onboarding and saves the profile", async () => {
  const calls = view({ clientProfiles: [] });
  await click("save address");
  await click("Back");
  for (const step of ["save address", "save user"]) await click(step);

  await waitFor(() =>
    expect(
      calls.some(
        (c) => c.method === "POST" && c.url.includes("clientProfiles"),
      ),
    ).toBe(true),
  );
  await waitFor(() =>
    expect(screen.getByTestId("path")).toHaveTextContent("/client"),
  );
});

it("shows the dashboard to a verified user", () => {
  view();
  expect(screen.getByText("dashboard")).toBeInTheDocument();
});

it("asks an unverified user for a photo", () => {
  view({ clientProfiles: [profile({ isVerified: false })] });
  expect(screen.getByText("verify photo")).toBeInTheDocument();
});

it("shows a spinner while loading", () => {
  view({ loading: true });
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});
