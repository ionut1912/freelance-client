import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { makeStore, profileState } from "../../testUtils";
import { buildProfile } from "../../testUtils/factories";
import { held, offline, recordRequests, reply } from "../../testUtils/handlers";
import { renderWithProviders } from "../../testUtils/render";
import UserForm from "./UserForm";

const png = new File(["x"], "a.png", { type: "image/png" });
const button = (name: string) => screen.getByRole("button", { name });
const box = (name: string) => screen.getByRole("textbox", { name });
const avatar = () => screen.getByRole("img", { name: "ana" });
const fileInput = () =>
  document.querySelector("#upload-input") as HTMLInputElement;

const setup = async (state: object = {}) => {
  reply("get", "current/userProfiles", buildProfile());
  const view = renderWithProviders(<UserForm />, {
    store: makeStore({
      auth: { user: null, role: "Client", error: null },
      userProfile: profileState(state) as never,
    }),
  });
  await waitFor(() => expect(box("Username")).toHaveValue("ana"));
  return view;
};

describe("<UserForm />", () => {
  beforeEach(() => {
    window.alert = jest.fn();
  });

  it("saves the edited account details", async () => {
    const { user } = await setup();
    reply("patch", "userProfiles/userData");
    const sent = recordRequests();

    await user.clear(box("Bio"));
    await user.type(box("Bio"), "Bio nouă 🚀");
    await user.click(button("Save changes"));

    expect(
      await screen.findByText("Profile updated successfully"),
    ).toBeInTheDocument();
    await expect(sent[0]?.body()).resolves.toMatchObject({
      username: "ana",
      bio: "Bio nouă 🚀",
    });
  });

  it.each([400, 409, 500])("reports a failed save (%i)", async (status) => {
    const { user } = await setup();
    reply("patch", "userProfiles/userData", { detail: "Refused" }, status);

    await user.click(button("Save changes"));

    expect(await screen.findByText("Refused")).toBeInTheDocument();
    expect(button("Save changes")).toBeEnabled();
  });

  it.each([
    ["Username", "Username is required"],
    ["Email", "Email is required"],
    ["Phone Number", "Phone number must be exactly 10 digits"],
    ["Bio", "Bio is required"],
  ])("requires %s", async (label, message) => {
    const { user } = await setup();

    await user.clear(box(label));
    await user.tab();

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it.each(["123456789", "12345678901", "abcdefghij"])(
    "rejects the phone number %s",
    async (phone) => {
      const { user } = await setup();

      await user.clear(box("Phone Number"));
      await user.type(box("Phone Number"), phone);
      await user.tab();

      expect(
        await screen.findByText("Phone number must be exactly 10 digits"),
      ).toBeInTheDocument();
    },
  );

  it("uploads a new picture", async () => {
    const { user } = await setup();
    reply("patch", "userProfiles");
    const sent = recordRequests();

    await user.upload(fileInput(), png);

    expect(
      await screen.findByText("Image updated successfully"),
    ).toBeInTheDocument();
    await expect(sent[0]?.body()).resolves.toEqual({
      image: "data:image/png;base64,eA==",
    });
  });

  it.each([
    [5 * 1024 * 1024, 0],
    [5 * 1024 * 1024 + 1, 1],
  ])("treats a %i byte file as too large: %i", async (size, alerts) => {
    const { user } = await setup();
    reply("patch", "userProfiles");
    const file = new File(["x"], "b.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: size });

    await user.upload(fileInput(), file);

    expect(window.alert).toHaveBeenCalledTimes(alerts);
  });

  it("refuses an unsupported file type", async () => {
    await setup();
    const sent = recordRequests();
    // Bypasses the input's accept filter, as a drag or "All files" would.

    await userEvent
      .setup({ applyAccept: false })
      .upload(fileInput(), new File(["x"], "a.gif", { type: "image/gif" }));

    expect(window.alert).toHaveBeenCalledWith(
      "Only JPG, JPEG, and PNG files are allowed.",
    );
    expect(sent).toHaveLength(0);
  });

  it("removes the picture after confirmation", async () => {
    const { user } = await setup();
    reply("patch", "userProfiles");
    const sent = recordRequests();

    await user.click(button("Remove picture"));
    await user.click(button("Yes"));

    await waitFor(() => expect(screen.queryByText("Yes")).toBeNull());
    await expect(sent[0]?.body()).resolves.toEqual({ image: "" });
  });

  it.each([["No"], ["{Escape}"]])(
    "keeps the picture when dismissed with %s",
    async (how) => {
      const { user } = await setup();
      const sent = recordRequests();
      await user.click(button("Remove picture"));

      if (how === "No") await user.click(button(how));
      else await user.keyboard(how);

      await waitFor(() => expect(screen.queryByText("Yes")).toBeNull());
      expect(sent).toHaveLength(0);
    },
  );

  it("keeps the picture when removing it fails", async () => {
    const { user } = await setup();
    offline("patch", "userProfiles");

    await user.click(button("Remove picture"));
    await user.click(button("Yes"));

    expect(await screen.findByText("Network Error")).toBeInTheDocument();
    expect(avatar()).toHaveAttribute("src", "data:image/png;base64,AAAA");
  });

  it.each([
    [{ loading: true }, "Loading user data..."],
    [{ clientProfiles: [] }, "No user profile found."],
  ])("explains the state %p", (state, message) => {
    reply("get", "current/userProfiles", {}, 401);

    renderWithProviders(<UserForm />, {
      store: makeStore({
        auth: { user: null, role: "Client", error: null },
        userProfile: profileState(state) as never,
      }),
    });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("disables saving while the request is in flight", async () => {
    const { user } = await setup();
    const release = held("patch", "userProfiles/userData");
    const sent = recordRequests();

    await user.click(button("Save changes"));

    expect(button("Saving...")).toBeDisabled();
    release();
    await waitFor(() => expect(button("Save changes")).toBeEnabled());
    expect(sent.filter((r) => r.method === "PATCH")).toHaveLength(1);
  });

  it("shows progress while a picture uploads", async () => {
    const { user } = await setup();
    const release = held("patch", "userProfiles");

    await user.upload(fileInput(), png);

    expect(await screen.findByText("Uploading...")).toBeInTheDocument();
    release();
    expect(await screen.findByText("Upload new")).toBeInTheDocument();
  });

  it("ignores a cancelled file choice", async () => {
    const { user } = await setup();
    const sent = recordRequests();

    await user.upload(fileInput(), []);

    expect(window.alert).not.toHaveBeenCalled();
    expect(sent).toHaveLength(0);
  });

  it("uses the freelancer profile and tolerates missing details", async () => {
    const empty = buildProfile({
      bio: "",
      image: "",
      user: { id: 3, username: "", email: "", phoneNumber: "" },
    });
    reply("get", "current/userProfiles", empty);

    renderWithProviders(<UserForm submitButtonText="Apply" />, {
      store: makeStore({
        auth: { user: null, role: "Freelancer", error: null },
        userProfile: profileState({ freelancerProfiles: [empty] }) as never,
      }),
    });

    expect(await screen.findByRole("button", { name: "Apply" })).toBeEnabled();
    expect(box("Username")).toHaveValue("");
  });
});
