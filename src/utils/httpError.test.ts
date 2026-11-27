import { AxiosError, type AxiosResponse } from "axios";
import { extractErrorMessages } from "../utils/httpError";

const failure = (data: unknown, message = "Request failed") =>
  new AxiosError(message, "ERR", undefined, undefined, {
    data,
  } as AxiosResponse);

it("lists validation errors", () => {
  const errors = [{ property: "Email", errorMessage: "is taken" }];
  expect(extractErrorMessages(failure({ errors }))).toEqual([
    "Email: is taken",
  ]);
});

it("falls back to detail, then the message", () => {
  expect(extractErrorMessages(failure({ detail: "Nope" }))).toEqual(["Nope"]);
  expect(extractErrorMessages(failure({ errors: [] }))).toEqual([
    "Request failed",
  ]);
});

it("handles unknown errors", () => {
  expect(extractErrorMessages(failure({}, ""))).toEqual(["Unexpected error"]);
  expect(extractErrorMessages(new Error("boom"))).toEqual(["Unexpected error"]);
});
