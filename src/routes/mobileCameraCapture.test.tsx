import { render, screen } from "@testing-library/react";
import Route from "../routes/mobileCameraCapture";

jest.mock("../components/camera/MobileCapturePage", () => () => (
  <p>page content</p>
));

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
