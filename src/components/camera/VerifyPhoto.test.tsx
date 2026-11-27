import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";
import VerifyPhoto from "../../components/camera/VerifyPhoto";
import { createHubConnection } from "../../lib/signalr";
import {
  fakeApi,
  fakeCamera,
  fakeHub,
  profile,
  renderApp,
} from "../../testUtils";

jest.mock("../../lib/signalr", () => ({ createHubConnection: jest.fn() }));

let hub: ReturnType<typeof fakeHub>;
beforeEach(() => {
  hub = fakeHub();
  jest.mocked(createHubConnection).mockReturnValue(hub.hub as never);
  window.history.pushState({}, "", "/");
});
afterEach(() => jest.restoreAllMocks());
const fakeSession = () => {
  window.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ sessionId: "s1", deepLink: "https://x/s1" }),
  });
};
const click = async (name: string) =>
  userEvent.click(await screen.findByRole("button", { name }));

const view = () => renderApp(<VerifyPhoto profile={profile() as never} />);

it("captures, retakes and sends the photo for verification", async () => {
  fakeCamera();
  const calls = fakeApi({ "POST verifyFace": [500] });
  view();

  await click("Start Camera");
  await click("Stop");
  await click("Start Camera");
  await click("Capture");
  expect(await screen.findByText("Preview (local)")).toBeInTheDocument();
  await click("Retake");
  expect(screen.queryByText("Preview (local)")).toBeNull();
  await click("Capture");
  await click("Verify Photo");

  await waitFor(() =>
    expect(calls[0]?.data).toEqual({
      faceBase64Image: "data:image/png;base64,SHOT",
    }),
  );
});

it("ignores a capture that yields no photo", async () => {
  const { getContext } = fakeCamera();
  getContext.mockReturnValue(null);
  view();
  await click("Start Camera");
  await click("Capture");
  expect(screen.queryByAltText("Captured")).toBeNull();
});

it("accepts a photo sent from another device", async () => {
  fakeCamera({ cameras: 0 });
  fakeSession();
  window.history.pushState({}, "", "/?session=s1");
  view();

  await waitFor(() => expect(hub.handlers.Photo).toBeDefined());
  act(() => hub.handlers.Photo("not-an-image"));
  expect(screen.queryByAltText("Captured")).toBeNull();
  act(() => hub.handlers.Photo("data:image/png;base64,A"));

  expect(screen.getByText("Preview (remote)")).toBeInTheDocument();
  expect(screen.getByText("Photo received from mobile")).toBeInTheDocument();
  userEvent.keyboard("{esc}");
  await click("Retake");
});
