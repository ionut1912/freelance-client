import { renderHook, waitFor } from "@testing-library/react";

import { useCameraAvailability } from "../hooks/useCameraAvailability";
import { fakeCamera } from "../testUtils";

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
