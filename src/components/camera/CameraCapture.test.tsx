import { render, screen } from "@testing-library/react";
import userEvent from "user-event-13";

import CameraCapture from "../../components/camera/CameraCapture";
import { createHubConnection } from "../../lib/signalr";
import { fakeCamera, fakeHub } from "../../testUtils";

jest.mock(
  "../../components/camera/RemoteCaptureFallback",
  () =>
    ({ onPhoto }: { onPhoto: (url: string) => void }) => (
      <button type="button" onClick={() => onPhoto("remote-shot")}>
        remote capture
      </button>
    ),
);

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

const view = (onChange = jest.fn(), image = "") => {
  render(<CameraCapture userData={{ bio: "", image }} onChange={onChange} />);
  return onChange;
};

it("starts, captures and stops the camera", async () => {
  const { stop } = fakeCamera();
  const onChange = view();
  await click("Start Camera");
  await click("Capture");
  expect(onChange).toHaveBeenCalledWith("image", "data:image/png;base64,SHOT");
  await click("Stop");
  expect(stop).toHaveBeenCalled();
});

it("ignores a capture that yields no photo", async () => {
  const { getContext } = fakeCamera();
  getContext.mockReturnValue(null);
  const onChange = view();
  await click("Start Camera");
  await click("Capture");
  expect(onChange).not.toHaveBeenCalled();
});

it("falls back to remote capture without a camera", async () => {
  fakeCamera({ cameras: 0 });
  const onChange = view(jest.fn(), "data:image/png;base64,A");
  await click("remote capture");
  expect(onChange).toHaveBeenCalledWith("image", "remote-shot");
  expect(screen.getByAltText("Captured")).toBeInTheDocument();
});
