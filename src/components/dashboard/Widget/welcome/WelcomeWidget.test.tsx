import { render, screen } from "@testing-library/react";

import WelcomeWidget from "../../../../components/dashboard/Widget/welcome/WelcomeWidget";

it("shows the greeting and a documentation button", () => {
  render(<WelcomeWidget title="Hi" description="There" />);
  expect(screen.getByText("Hi")).toBeInTheDocument();
  expect(screen.getByText("There")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Documentation" }),
  ).toBeInTheDocument();
});
