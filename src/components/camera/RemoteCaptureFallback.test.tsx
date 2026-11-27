import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RemoteCaptureFallback from "../../components/camera/RemoteCaptureFallback";
import { createHubConnection } from "../../lib/signalr";
import { fakeHub } from "../../testUtils";

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

it("shows the deep link and receives the photo", async () => {
  fakeSession();
  const writeText = jest.fn();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  hub.hub.stop.mockRejectedValue(new Error("already stopped"));
  const onPhoto = jest.fn();
  const { unmount } = render(<RemoteCaptureFallback onPhoto={onPhoto} />);

  await click("Copiază");
  expect(writeText).toHaveBeenCalledWith("https://x/s1");
  await waitFor(() => expect(hub.handlers.PhotoReceived).toBeDefined());
  hub.handlers.PhotoReceived({ dataUrl: "data:image/png;base64,A" });
  expect(onPhoto).toHaveBeenCalledWith("data:image/png;base64,A");
  unmount();
  expect(hub.hub.stop).toHaveBeenCalled();
});

it("renders nothing when the session cannot be created", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  window.fetch = jest.fn().mockRejectedValue(new Error("offline"));
  const { unmount } = render(<RemoteCaptureFallback onPhoto={jest.fn()} />);
  await waitFor(() => expect(log).toHaveBeenCalled());
  expect(screen.queryByRole("button")).toBeNull();
  unmount();
});
