import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/render";

import Page from "./not-found";

describe("not-found route", () => {
  it("renders its page", async () => {
    renderWithProviders(<Page />);

    expect(
      await screen.findByRole("button", { name: "Return Home" }),
    ).toBeInTheDocument();
  });
});
