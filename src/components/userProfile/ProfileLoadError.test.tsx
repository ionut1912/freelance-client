import { screen, waitFor } from "@testing-library/react";

import { makeStore } from "../../testUtils";
import { buildProfile } from "../../testUtils/factories";
import { offline, recordRequests, reply } from "../../testUtils/handlers";
import { renderWithProviders } from "../../testUtils/render";

import ProfileLoadError from "./ProfileLoadError";

const setup = () =>
  renderWithProviders(<ProfileLoadError />, {
    store: makeStore({ auth: { user: null, role: "Client", error: null } }),
  });
const retry = () => screen.getByRole("button", { name: "Retry" });

describe("<ProfileLoadError />", () => {
  it("explains the failure and requests nothing by itself", () => {
    const sent = recordRequests();

    setup();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load your profile.",
    );
    expect(sent).toHaveLength(0);
  });

  it("loads the profile again on retry", async () => {
    reply("get", "current/userProfiles", buildProfile());
    const { user, store } = setup();

    await user.click(retry());

    await waitFor(() =>
      expect(store.getState().userProfile.clientProfiles).toHaveLength(1),
    );
    expect(store.getState().userProfile.loadFailed).toBe(false);
  });

  it("stays marked as failed when the retry fails too", async () => {
    offline("get", "current/userProfiles");
    const { user, store } = setup();

    await user.click(retry());

    await waitFor(() =>
      expect(store.getState().userProfile.loadFailed).toBe(true),
    );
    expect(retry()).toBeEnabled();
  });
});
