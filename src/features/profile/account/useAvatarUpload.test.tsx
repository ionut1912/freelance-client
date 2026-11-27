import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent, ReactNode } from "react";
import { Provider } from "react-redux";

import { makeStore } from "../../../testUtils";

import { useAvatarUpload } from "./useAvatarUpload";

const setup = () => {
  const store = makeStore({});
  const reset = jest.fn();
  const { result } = renderHook(() => useAvatarUpload(jest.fn(), reset), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });
  const upload = (files: File[] | null) =>
    result.current.handleUpload({
      target: { files, value: "" },
    } as unknown as ChangeEvent<HTMLInputElement>);
  return { result, reset, upload };
};

afterEach(() => jest.restoreAllMocks());

it("does nothing when the input has no files", async () => {
  const { reset, upload } = setup();

  await act(() => upload(null));

  expect(reset).not.toHaveBeenCalled();
});

it.each([
  [null, "Could not read the file"],
  [new Error("Disk gone"), "Disk gone"],
])("reports a file that cannot be read: %s", async (error, message) => {
  jest
    .spyOn(FileReader.prototype, "readAsDataURL")
    .mockImplementation(function (this: FileReader) {
      Object.defineProperty(this, "error", { value: error });
      setTimeout(() => {
        this.onerror?.({} as ProgressEvent<FileReader>);
      });
    });
  const { result, upload } = setup();

  await act(async () => {
    await expect(
      upload([new File(["x"], "a.png", { type: "image/png" })]),
    ).rejects.toThrow(message);
  });

  expect(result.current.uploading).toBe(false);
});
