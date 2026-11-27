import { screen } from "@testing-library/react";
import { makeStore } from "../testUtils";
import { buildProfile } from "../testUtils/factories";
import { reply, replyLookups } from "../testUtils/handlers";
import { renderWithProviders } from "../testUtils/render";
import Page from "./userProfile";

// Charts need real layout, which jsdom does not have.
jest.mock("@nivo/geo", () => ({ ResponsiveChoropleth: () => null }));
jest.mock("@nivo/bar", () => ({ ResponsiveBar: () => null }));

describe("userProfile route", () => {
  it("renders the account tabs", async () => {
    reply("get", "current/userProfiles", buildProfile());
    replyLookups();
    const store = makeStore({
      auth: { user: null, role: "Client", error: null },
    });

    renderWithProviders(<Page />, { store });

    expect(
      await screen.findByRole("tab", { name: "General" }),
    ).toBeInTheDocument();
  });
});
