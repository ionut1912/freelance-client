import { screen } from "@testing-library/react";

import { renderWithProviders } from "../testUtils/render";

import Page from "./login";

describe("login route", () => {
  it("renders its page", async () => {
    renderWithProviders(<Page />);

    expect(
      await screen.findByRole("button", { name: "Log In" }),
    ).toBeInTheDocument();
  });
});
