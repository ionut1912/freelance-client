import { screen } from "@testing-library/react";

import { renderWithProviders } from "../testUtils/render";

import Page from "./register";

describe("register route", () => {
  it("renders its page", async () => {
    renderWithProviders(<Page />);

    expect(
      await screen.findByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
  });
});
