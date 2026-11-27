import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/render";

import Page from "./unauthorized";

describe("unauthorized route", () => {
  it("renders its page", async () => {
    renderWithProviders(<Page />);

    expect(
      await screen.findByRole("heading", { name: "Access denied" }),
    ).toBeInTheDocument();
  });
});
