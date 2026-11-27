import { fireEvent, render, screen } from "@testing-library/react";
import GenericModal from "../../components/wrappers/GenericModal";

it("reports Yes, No and close", () => {
  const onYes = jest.fn();
  const onNo = jest.fn();
  const handleClose = jest.fn();
  render(
    <GenericModal
      open
      text="Delete?"
      handleClose={handleClose}
      onYes={onYes}
      onNo={onNo}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Yes" }));
  fireEvent.click(screen.getByRole("button", { name: "No" }));
  fireEvent.keyDown(screen.getByText("Delete?"), { key: "Escape" });

  expect(onYes).toHaveBeenCalledTimes(1);
  expect(onNo).toHaveBeenCalledTimes(1);
  expect(handleClose).toHaveBeenCalledTimes(1);
});

it("renders nothing and calls nothing while closed", () => {
  const handlers = {
    handleClose: jest.fn(),
    onYes: jest.fn(),
    onNo: jest.fn(),
  };
  render(<GenericModal open={false} text="Delete?" {...handlers} />);

  expect(screen.queryByText("Delete?")).toBeNull();
  for (const handler of Object.values(handlers)) {
    expect(handler).not.toHaveBeenCalled();
  }
});
