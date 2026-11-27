import { renderHook, waitFor } from "@testing-library/react";

import { createHubConnection } from "../../lib/signalr";
import { fakeHub } from "../../testUtils";

import { useRemotePhotoReceiver } from "./useRemotePhotoReceiver";

jest.mock("../../lib/signalr", () => ({
  ...jest.requireActual<object>("../../lib/signalr"),
  createHubConnection: jest.fn(),
}));

let hub: ReturnType<typeof fakeHub>;
beforeEach(() => {
  hub = fakeHub();
  jest.mocked(createHubConnection).mockReturnValue(hub.hub as never);
});

it("does not connect without a session", () => {
  renderHook(() => useRemotePhotoReceiver("", jest.fn()));
  expect(createHubConnection).not.toHaveBeenCalled();
});

it("forwards photos for its session until unmounted", async () => {
  const onPhoto = jest.fn();
  const { unmount } = renderHook(() => useRemotePhotoReceiver("s1", onPhoto));
  await waitFor(() => expect(hub.handlers.reconnected).toBeDefined());
  const emitAll = (sid: string, data: string) => {
    hub.handlers.PhotoDataUrl(sid, data);
    hub.handlers.SendPhotoDataUrl(sid, data);
  };

  emitAll("s1", "a");
  emitAll("", "b");
  emitAll("other", "ignored");
  hub.handlers.Photo("c");
  hub.handlers.reconnected();
  expect(onPhoto.mock.calls).toEqual([["a"], ["a"], ["b"], ["b"], ["c"]]);
  expect(hub.hub.invoke).toHaveBeenCalledTimes(2);

  unmount();
  emitAll("s1", "late");
  hub.handlers.Photo("late");
  expect(onPhoto).toHaveBeenCalledTimes(5);
  expect(hub.hub.stop).toHaveBeenCalled();
});

it("logs a connection failure", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  hub.hub.start.mockRejectedValue(new Error("offline"));
  renderHook(() => useRemotePhotoReceiver("s1", jest.fn()));
  await waitFor(() => expect(log).toHaveBeenCalled());
  log.mockRestore();
});

it("keeps one connection when the callback changes", async () => {
  const first = jest.fn();
  const second = jest.fn();
  const { rerender } = renderHook(
    ({ onPhoto }) => useRemotePhotoReceiver("s1", onPhoto),
    { initialProps: { onPhoto: first } },
  );
  await waitFor(() => expect(hub.hub.invoke).toHaveBeenCalled());

  rerender({ onPhoto: second });
  hub.handlers.Photo("a");

  expect(createHubConnection).toHaveBeenCalledTimes(1);
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledWith("a");
});
