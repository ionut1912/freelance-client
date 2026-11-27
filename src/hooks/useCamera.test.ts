import { act, renderHook } from "@testing-library/react";
import { useCamera } from "../hooks/useCamera";
import { fakeCamera } from "../testUtils";

const mount = () => {
  const hook = renderHook(() => useCamera());
  hook.result.current.videoRef.current = document.createElement("video");
  hook.result.current.canvasRef.current = document.createElement("canvas");
  return hook;
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
