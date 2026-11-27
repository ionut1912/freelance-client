import { render, screen } from "@testing-library/react";
import Route from "../routes/userProfile";

jest.mock("../components/userProfile/UserAccountPage", () => () => (
  <p>page content</p>
));

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
