import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/render";
import { replyLookups, reply } from "../testUtils/handlers";
import Page from "./freelancerProfile";

// Charts need real layout, which jsdom does not have.
jest.mock("@nivo/geo", () => ({ ResponsiveChoropleth: () => null }));
jest.mock("@nivo/bar", () => ({ ResponsiveBar: () => null }));

describe("freelancerProfile route", () => {
  it("renders its page", async () => {
    reply("get", "current/userProfiles", null);
    replyLookups();
    renderWithProviders(<Page />);

    expect(
      await screen.findByRole("button", { name: "Save Address" }),
    ).toBeInTheDocument();
  });
});
