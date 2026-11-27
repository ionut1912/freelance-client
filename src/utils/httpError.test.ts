import { AxiosError, type AxiosResponse } from "axios";

import { extractErrorMessages } from "./httpError";

const failure = (data: unknown, message = "Request failed") =>
  new AxiosError(message, "ERR", undefined, undefined, {
    data,
  } as AxiosResponse);

const invalid = (property: string) => ({
  property,
  errorMessage: "is invalid",
});

describe("extractErrorMessages", () => {
  it("lists every validation error", () => {
    const errors = [invalid("Email"), invalid("Nume ș 🚀")];

    expect(extractErrorMessages(failure({ errors }))).toEqual([
      "Email: is invalid",
      "Nume ș 🚀: is invalid",
    ]);
  });

  it("keeps a very long list intact", () => {
    const errors = Array.from({ length: 1000 }, (_, i) => invalid(`F${i}`));

    expect(extractErrorMessages(failure({ errors }))).toHaveLength(1000);
  });

  it("prefers validation errors over the detail", () => {
    const data = { errors: [invalid("Email")], detail: "Nope" };

    expect(extractErrorMessages(failure(data))).toEqual(["Email: is invalid"]);
  });

  it("uses the detail when there are no validation errors", () => {
    expect(extractErrorMessages(failure({ errors: [], detail: "No" }))).toEqual(
      ["No"],
    );
  });

  it.each([{}, null, undefined, "<html>", { errors: "x" }])(
    "uses the error message for the body %p",
    (data) => {
      expect(extractErrorMessages(failure(data))).toEqual(["Request failed"]);
    },
  );

  it.each([failure({}, ""), new Error("boom"), "x", null, undefined])(
    "reports an unexpected error for %p",
    (error) => {
      expect(extractErrorMessages(error)).toEqual(["Unexpected error"]);
    },
  );
});
