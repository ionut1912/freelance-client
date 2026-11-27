import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/render";

import Page from "./_index";

describe("_index route", () => {
  it("renders its page", async () => {
    renderWithProviders(<Page />);

    expect(
      await screen.findByRole("link", { name: "Join as Client" }),
    ).toBeInTheDocument();
  });
});
