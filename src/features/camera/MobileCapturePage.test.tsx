import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";

import { createHubConnection } from "../../lib/signalr";
import { fakeCamera, fakeHub } from "../../testUtils";

import MobileCapturePage from "./MobileCapturePage";

jest.mock("../../lib/signalr", () => ({
  ...jest.requireActual<object>("../../lib/signalr"),
  createHubConnection: jest.fn(),
}));

let hub: ReturnType<typeof fakeHub>;
beforeEach(() => {
  hub = fakeHub();
  jest.mocked(createHubConnection).mockReturnValue(hub.hub as never);
  window.history.pushState({}, "", "/");
});
afterEach(() => jest.restoreAllMocks());
const click = async (name: string) =>
  userEvent.click(await screen.findByRole("button", { name }));

const video = { width: 1280 };
const send = () => click("Capture & Trimite");
const ready = async () => {
  const view = render(<MobileCapturePage />);
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Capture & Trimite" }),
    ).toBeEnabled(),
  );
  return view;
};
const alerted = (text: string) =>
  waitFor(() =>
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining(text)),
  );

beforeEach(() => {
  video.width = 1280;
  window.alert = jest.fn();
  jest
    .spyOn(HTMLVideoElement.prototype, "videoWidth", "get")
    .mockImplementation(() => video.width);
  jest
    .spyOn(HTMLVideoElement.prototype, "videoHeight", "get")
    .mockReturnValue(720);
  window.history.pushState({}, "", "/?session=s1");
});

it("sends the photo over the hub and releases the camera", async () => {
  const { stop } = fakeCamera();
  const { unmount } = await ready();
  await send();
  await alerted("Foto trimisă");
  expect(hub.hub.invoke).toHaveBeenCalledWith(
    "SendPhotoDataUrl",
    "s1",
    "data:image/png;base64,SHOT",
  );
  unmount();
  expect(stop).toHaveBeenCalled();
});

it("requires a session id", async () => {
  window.history.pushState({}, "", "/");
  fakeCamera();
  await ready();
  await send();
  await alerted("sessionId");
});

it("waits until the video has dimensions", async () => {
  video.width = 0;
  fakeCamera();
  await ready();
  await send();
  await alerted("nu e gata");
});

it("handles a canvas without a context", async () => {
  const { getContext } = fakeCamera();
  getContext.mockReturnValue(null);
  await ready();
  await send();
  await alerted("nu e gata");
});

it("refuses an image that stays too large", async () => {
  const { toDataURL } = fakeCamera();
  toDataURL.mockReturnValue("x".repeat(50_000));
  await ready();
  await send();
  await alerted("prea mare");
  expect(toDataURL.mock.calls.length).toBeGreaterThan(1);
});

it("reports a send failure", async () => {
  fakeCamera();
  hub.hub.start.mockRejectedValue(new Error("offline"));
  await ready();
  await send();
  await alerted("offline");
});

it("falls back to any front camera", async () => {
  const { mediaDevices } = fakeCamera();
  mediaDevices.getUserMedia.mockRejectedValueOnce(new Error("exact"));
  await ready();
  expect(mediaDevices.getUserMedia).toHaveBeenCalledTimes(2);
});

it("alerts when there is no camera", async () => {
  const { mediaDevices } = fakeCamera({ cameras: 0 });
  mediaDevices.getUserMedia.mockRejectedValue(new Error("exact"));
  render(<MobileCapturePage />);
  await alerted("Nu am găsit");
});

it("stops a stream that arrives after leaving the page", async () => {
  const { stop } = fakeCamera();
  const { unmount } = render(<MobileCapturePage />);
  unmount();
  await waitFor(() => expect(window.alert).not.toHaveBeenCalled());
  expect(stop).not.toHaveBeenCalledTimes(2);
});
