import { screen, waitFor } from "@testing-library/react";

import { fakeCamera, makeStore } from "../../testUtils";
import { buildProfile } from "../../testUtils/factories";
import {
  offline,
  recordRequests,
  reply,
  replyLookups,
} from "../../testUtils/handlers";
import { renderWithProviders } from "../../testUtils/render";

import FreelancerPage from "./FreelancerPage";

// Charts need real layout, which jsdom does not have.
jest.mock("@nivo/geo", () => ({ ResponsiveChoropleth: () => null }));
jest.mock("@nivo/bar", () => ({ ResponsiveBar: () => null }));

const setup = () =>
  renderWithProviders(<FreelancerPage />, {
    store: makeStore({
      auth: { user: null, role: "Freelancer", error: null },
    }),
    path: "/start",
  });
type User = ReturnType<typeof setup>["user"];

const click = async (user: User, name: string) =>
  user.click(await screen.findByRole("button", { name }));
const box = (name: string) => screen.getByRole("textbox", { name });

const fillAddress = async (user: User) => {
  await user.click(await screen.findByRole("combobox", { name: "Country" }));
  await user.click(await screen.findByRole("option", { name: "Romania" }));
  await user.click(screen.getByRole("combobox", { name: "City" }));
  await user.click(await screen.findByRole("option", { name: "Cluj" }));
  await user.type(box("Street"), "Main");
  await user.type(box("Street Number"), "1");
  await user.type(box("Zip"), "400000");
  await click(user, "Save Address");
};

describe("<FreelancerPage />", () => {
  beforeEach(() => replyLookups());

  it("shows a spinner while the profile loads", () => {
    reply("get", "current/userProfiles", null);

    setup();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows the dashboard to a verified user", async () => {
    reply("get", "current/userProfiles", buildProfile());

    setup();

    expect(
      await screen.findByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });

  it("asks an unverified user for a photo", async () => {
    fakeCamera();
    reply("get", "current/userProfiles", buildProfile({ isVerified: false }));

    setup();

    expect(
      await screen.findByRole("heading", { name: "Camera Verification" }),
    ).toBeInTheDocument();
  });

  it.each([404, 400])("starts onboarding on HTTP %i", async (status) => {
    reply("get", "current/userProfiles", {}, status);

    setup();

    expect(
      await screen.findByRole("button", { name: "Save Address" }),
    ).toBeInTheDocument();
  });

  it.each([500, 503])(
    "offers a retry, not onboarding, on HTTP %i",
    async (status) => {
      reply("get", "current/userProfiles", {}, status);
      const { user } = setup();
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "We could not load your profile.",
      );
      expect(
        screen.queryByRole("button", { name: "Save Address" }),
      ).not.toBeInTheDocument();
      reply("get", "current/userProfiles", buildProfile());

      await click(user, "Retry");

      expect(
        await screen.findByRole("heading", { name: "Dashboard" }),
      ).toBeInTheDocument();
    },
  );

  it("offers a retry when offline", async () => {
    offline("get", "current/userProfiles");

    setup();

    expect(
      await screen.findByRole("button", { name: "Retry" }),
    ).toBeInTheDocument();
  });

  it("goes back to the address step with the values kept", async () => {
    fakeCamera();
    reply("get", "current/userProfiles", null);
    const { user } = setup();
    await fillAddress(user);

    await click(user, "Back");

    expect(box("Street")).toHaveValue("Main");
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
  });

  it("completes onboarding and creates the profile", async () => {
    fakeCamera();
    reply("get", "current/userProfiles", null);
    reply("post", "freelancerProfiles");
    const sent = recordRequests();
    const { user } = setup();

    await fillAddress(user);
    await user.type(box("Bio"), "A long enough biography");
    await click(user, "Start Camera");
    await click(user, "Capture");
    const save = screen.getByRole("button", { name: "Save User Details" });
    await waitFor(() => expect(save).toBeEnabled());
    await user.click(save);

    await user.click(
      await screen.findByRole("combobox", { name: "Programming Languages" }),
    );
    await user.click(await screen.findByRole("option", { name: "Go" }));
    await user.click(
      screen.getByRole("combobox", { name: "Foreign Languages" }),
    );
    await user.click(await screen.findByRole("option", { name: "Romanian" }));
    await user.type(box("Experience"), "5 years");
    await user.clear(screen.getByRole("spinbutton", { name: "Rate" }));
    await user.type(screen.getByRole("spinbutton", { name: "Rate" }), "50");
    await user.type(box("Currency"), "eur");
    await user.type(box("Portfolio URL"), "https://example.com");
    await click(user, "Save Freelancer Details");

    expect(
      await screen.findByText("Freelancer profile created successfully"),
    ).toBeInTheDocument();
    const created = sent.find((r) => r.path === "freelancerProfiles");
    await expect(created?.body()).resolves.toMatchObject({
      address: { addressCountry: "Romania", addressCity: "Cluj" },
      user: { bio: "A long enough biography" },
      freelancer: { currency: "EUR", rate: 50 },
    });
  });
});
