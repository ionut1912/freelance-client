import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FieldError } from "react-hook-form";

import FormField from "./FormField";

const setup = (error?: FieldError) => {
  const registration = {
    name: "username",
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  };
  render(
    <FormField label="Username" registration={registration} error={error} />,
  );
  return registration;
};
const input = () => screen.getByRole("textbox", { name: "Username" });

describe("<FormField />", () => {
  it("wires the input to the registration", async () => {
    const registration = setup();
    const user = userEvent.setup();

    await user.type(input(), "a");
    await user.tab();

    expect(input()).toHaveAttribute("name", "username");
    expect(input()).toHaveAttribute("aria-invalid", "false");
    expect(registration.onChange).toHaveBeenCalled();
    expect(registration.onBlur).toHaveBeenCalled();
  });

  it("shows the error message", () => {
    setup({ type: "required", message: "Username is required" });

    expect(input()).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Username is required")).toBeInTheDocument();
  });

  it("has a fallback for an error without a message", () => {
    setup({ type: "custom" });

    expect(screen.getByText("Invalid field")).toBeInTheDocument();
  });
});
