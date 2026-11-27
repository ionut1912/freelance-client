import { act, renderHook, waitFor } from "@testing-library/react";
import * as Yup from "yup";
import { useForm } from "../hooks/useForm";

const schema = Yup.object({ name: Yup.string().required("Required") });

it("validates on mount when asked and submits valid values", async () => {
  const onSubmit = jest.fn();
  const { result } = renderHook(() =>
    useForm({ name: "" }, schema, onSubmit, true),
  );
  await waitFor(() => expect(result.current.errors.name).toBe("Required"));

  await act(async () => {
    await result.current.setFieldValue("name", "ana");
  });
  await act(async () => {
    await result.current.submitForm();
  });
  expect(onSubmit).toHaveBeenCalledWith({ name: "ana" }, expect.anything());
});

it("does not validate on mount by default", () => {
  const { result } = renderHook(() => useForm({ name: "" }, schema, jest.fn()));
  expect(result.current.errors).toEqual({});
});
