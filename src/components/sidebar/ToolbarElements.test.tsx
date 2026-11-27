import { screen } from "@testing-library/react";
import ToolbarElements from "../../components/sidebar/ToolbarElements";
import { fakeApi, makeStore, profileState, renderApp } from "../../testUtils";

jest.mock("../../components/sidebar/user-menu/UserMenu", () => () => (
  <p>user menu</p>
));

const view = (role: "Client" | "Freelancer", state: object) => {
  // A failing request leaves the preloaded state untouched.
  fakeApi({ "GET current": [500] });
  renderApp(<ToolbarElements role={role} />, {
    store: makeStore({ userProfile: profileState(state) as never }),
  });
};

it.each(["Client", "Freelancer"] as const)("shows the %s menu", (role) => {
  view(role, {});
  expect(screen.getByText("user menu")).toBeInTheDocument();
});

it("shows a spinner while loading", () => {
  view("Client", { loading: true });
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

it("shows no menu without a profile", () => {
  view("Client", { clientProfiles: [] });
  expect(screen.queryByText("user menu")).toBeNull();
});
