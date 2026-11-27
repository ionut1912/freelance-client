import { act, renderHook } from "@testing-library/react";

import { useCamera } from "../hooks/useCamera";
import { fakeCamera } from "../testUtils";

const mount = () => {
  const view = renderHook(() => useCamera());
  view.result.current.videoRef.current = document.createElement("video");
  view.result.current.canvasRef.current = document.createElement("canvas");
  return view;
};

afterEach(() => jest.restoreAllMocks());

it("starts, captures and stops", async () => {
  const { stop } = fakeCamera();
  const { result } = mount();

  await act(async () => {
    await result.current.startCamera();
  });
  expect(result.current.streaming).toBe(true);
  expect(result.current.capturePhoto()).toBe("data:image/png;base64,SHOT");

  act(() => result.current.stopCamera());
  expect(stop).toHaveBeenCalled();
  expect(result.current.streaming).toBe(false);
});

it("returns null when the canvas has no context", () => {
  const { getContext } = fakeCamera();
  getContext.mockReturnValue(null);
  expect(mount().result.current.capturePhoto()).toBeNull();
});

it.each([
  [new Error("denied"), "denied"],
  [new Error(""), "Could not start video source"],
])("records a start failure", async (error, message) => {
  const { mediaDevices } = fakeCamera();
  mediaDevices.getUserMedia.mockRejectedValue(error);
  const { result } = renderHook(() => useCamera());

  await act(async () => {
    await result.current.startCamera();
  });

  expect(result.current.error).toBe(message);
  expect(result.current.capturePhoto()).toBeNull();
});

it("switches the camera off on unmount", async () => {
  const { stop } = fakeCamera();
  const { result, unmount } = mount();
  await act(async () => {
    await result.current.startCamera();
  });

  unmount();

  expect(stop).toHaveBeenCalled();
});

it("releases a stream granted after unmount", async () => {
  const { stop } = fakeCamera();
  const { result, unmount } = mount();
  const { startCamera } = result.current;

  const started = startCamera();
  unmount();

  await expect(started).resolves.toBe(false);
  expect(stop).toHaveBeenCalled();
});
