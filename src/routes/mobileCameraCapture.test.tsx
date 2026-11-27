import { screen, waitFor } from "@testing-library/react";

import { fakeCamera } from "../testUtils";
import { renderWithProviders } from "../testUtils/render";

import Page from "./mobileCameraCapture";

describe("mobileCameraCapture route", () => {
  it("renders its page", async () => {
    fakeCamera();

    renderWithProviders(<Page />);

    expect(
      await screen.findByRole("button", { name: "Capture & Trimite" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());
  });
});
