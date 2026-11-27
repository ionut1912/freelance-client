import { fireEvent, render, screen } from "@testing-library/react";

import PasswordInput from "./PasswordInput";

it("toggles visibility and reports changes", () => {
  const onChange = jest.fn();
  render(<PasswordInput label="Password" value="" onChange={onChange} />);
  const input = screen.getByLabelText("Password");
  const toggle = screen.getByLabelText("toggle password visibility");

  expect(input).toHaveAttribute("type", "password");
  fireEvent.mouseDown(toggle);
  fireEvent.click(toggle);
  expect(input).toHaveAttribute("type", "text");

  fireEvent.change(input, { target: { value: "abc" } });
  expect(onChange).toHaveBeenCalledWith("abc");
});

it("hides the password again on a second toggle", () => {
  render(<PasswordInput label="Password" value="abc" onChange={jest.fn()} />);
  const toggle = screen.getByLabelText("toggle password visibility");

  fireEvent.click(toggle);
  fireEvent.click(toggle);

  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  expect(toggle).toHaveAttribute("aria-pressed", "false");
});

it("shows the error and reports blur", () => {
  const onBlur = jest.fn();
  render(
    <PasswordInput
      label="Password"
      value=""
      onChange={jest.fn()}
      onBlur={onBlur}
      error
      helperText="Password is required"
    />,
  );
  const input = screen.getByLabelText("Password");

  fireEvent.blur(input);

  expect(onBlur).toHaveBeenCalledTimes(1);
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Password is required")).toBeInTheDocument();
});
