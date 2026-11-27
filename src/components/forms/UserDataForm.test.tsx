import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserDataForm from "../../components/forms/UserDataForm";
import { renderApp } from "../../testUtils";
import type * as UseForm from "../../hooks/useForm";

// The component revalidates the photo on every render (see the last test), and
// real revalidation re-renders, so it would loop forever inside `act`. Only
// `validateField` is stubbed; the rest of formik is real.
const mockValidateField = jest.fn();
jest.mock("../../hooks/useForm", () => {
  const actual = jest.requireActual<typeof UseForm>("../../hooks/useForm");
  return {
    useForm: (...args: Parameters<typeof actual.useForm>) => ({
      ...actual.useForm(...args),
      validateField: mockValidateField,
    }),
  };
});

jest.mock(
  "../../components/camera/CameraCapture",
  () =>
    ({ onChange }: { onChange: (f: string, v: string | null) => void }) => (
      <>
        <button
          type="button"
          onClick={() => onChange("image", "data:image/png;base64,A")}
        >
          take photo
        </button>
        <button type="button" onClick={() => onChange("image", null)}>
          clear photo
        </button>
      </>
    ),
);

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const blur = (label: string) => fireEvent.blur(screen.getByLabelText(label));
const button = (name: string) => screen.getByRole("button", { name });

it("submits a bio and photo", async () => {
  const onSubmit = jest.fn();
  renderApp(<UserDataForm onSubmit={onSubmit} />);

  blur("Bio");
  expect(await screen.findByText("Bio is required")).toBeInTheDocument();
  type("Bio", "A long enough biography");
  userEvent.click(button("clear photo"));
  await waitFor(() => expect(button("Save User Details")).toBeDisabled());
  userEvent.click(button("take photo"));
  await waitFor(() => expect(button("Save User Details")).toBeEnabled());
  userEvent.click(button("Save User Details"));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      {
        bio: "A long enough biography",
        image: "data:image/png;base64,A",
      },
      expect.anything(),
    ),
  );
});

// Known bug: the effect depends on the whole `formik` object, which is new on
// every render, so the photo is validated again and again.
// `it.failing` passes while the bug exists; change it to `it` once fixed.
it.failing("validates the photo only when it changes", async () => {
  renderApp(<UserDataForm onSubmit={jest.fn()} />);
  userEvent.click(button("take photo"));
  await waitFor(() => expect(mockValidateField).toHaveBeenCalled());
  mockValidateField.mockClear();

  type("Bio", "A different biography");
  await waitFor(() =>
    expect(screen.getByLabelText("Bio")).toHaveValue("A different biography"),
  );

  expect(mockValidateField).not.toHaveBeenCalled();
});
