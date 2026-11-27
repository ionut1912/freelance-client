import { act, renderHook, waitFor } from "@testing-library/react";

import { fakeCamera } from "../../testUtils";

import { useCameraAvailability } from "./useCameraAvailability";

afterEach(() => jest.restoreAllMocks());

it.each([
  [1, true],
  [0, false],
])("with %i cameras reports %s", async (cameras, expected) => {
  fakeCamera({ cameras });
  const { result } = renderHook(() => useCameraAvailability());
  await waitFor(() => expect(result.current.checking).toBe(false));
  expect(result.current.hasCamera).toBe(expected);
});

it("reports no camera when devices cannot be listed", async () => {
  const { mediaDevices } = fakeCamera();
  mediaDevices.enumerateDevices.mockRejectedValue(new Error("denied"));
  const { result } = renderHook(() => useCameraAvailability());
  await waitFor(() => expect(result.current.checking).toBe(false));
  expect(result.current.hasCamera).toBe(false);
});

it.each(["resolve", "reject"] as const)(
  "ignores a device list that arrives after unmount (%s)",
  async (outcome) => {
    const { mediaDevices } = fakeCamera();
    let settle = () => {};
    mediaDevices.enumerateDevices.mockReturnValue(
      new Promise((resolve, reject) => {
        settle = () =>
          outcome === "resolve" ? resolve([]) : reject(new Error("denied"));
      }),
    );
    const { result, unmount } = renderHook(() => useCameraAvailability());

    unmount();
    await act(() => {
      settle();
      return Promise.resolve();
    });

    expect(result.current.checking).toBe(true);
  },
);
