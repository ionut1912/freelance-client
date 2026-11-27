import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";

import UserDataForm from "../../components/forms/UserDataForm";
import { renderApp } from "../../testUtils";

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

it("disables saving again when the photo is cleared", async () => {
  renderApp(<UserDataForm onSubmit={jest.fn()} />);
  type("Bio", "A long enough biography");
  userEvent.click(button("take photo"));
  await waitFor(() => expect(button("Save User Details")).toBeEnabled());

  userEvent.click(button("clear photo"));

  await waitFor(() => expect(button("Save User Details")).toBeDisabled());
});
