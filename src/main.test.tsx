import { act, waitFor } from "@testing-library/react";
import type * as Router from "react-router";

jest.mock("./routes", () => {
  const { createMemoryRouter } =
    jest.requireActual<typeof Router>("react-router");
  return { router: createMemoryRouter([{ path: "/", element: "app" }]) };
});

it("mounts the app into #root", async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await act(async () => {
    await import("./main");
  });
  await waitFor(() =>
    expect(document.querySelector("#root")).toHaveTextContent("app"),
  );
});

it("fails loudly without #root", async () => {
  document.body.innerHTML = "";
  await jest.isolateModulesAsync(async () => {
    await expect(import("./main")).rejects.toThrow("#root not found");
  });
});
