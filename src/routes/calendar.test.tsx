import { screen } from "@testing-library/react";
import { Suspense } from "react";

import { renderWithProviders } from "../testUtils/render";

import Page from "./calendar";

describe("calendar route", () => {
  it("renders the current month", async () => {
    renderWithProviders(
      <Suspense>
        <Page />
      </Suspense>,
    );

    const month = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    expect(
      await screen.findByRole("button", { name: month }),
    ).toBeInTheDocument();
  });
});
