import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import CheckboxWithForm from "../../../components/forms/common/CheckboxWithForm";

it("binds the checkbox to the form value", () => {
  const { result } = renderHook(() =>
    useForm({ defaultValues: { agree: false } }),
  );
  render(
    <CheckboxWithForm
      control={result.current.control}
      name="agree"
      label="Agree"
    />,
  );
  const box = screen.getByLabelText("Agree");

  fireEvent.click(box);
  fireEvent.blur(box);

  expect(box).toBeChecked();
  expect(result.current.getValues("agree")).toBe(true);
});

it("reflects a checked default and can be cleared", () => {
  const { result } = renderHook(() =>
    useForm({ defaultValues: { agree: true } }),
  );
  render(
    <CheckboxWithForm
      control={result.current.control}
      name="agree"
      label="Agree"
    />,
  );
  const box = screen.getByLabelText("Agree");
  expect(box).toBeChecked();

  fireEvent.click(box);

  expect(box).not.toBeChecked();
  expect(result.current.getValues("agree")).toBe(false);
});
