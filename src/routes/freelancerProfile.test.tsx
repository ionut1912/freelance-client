import { render, screen } from "@testing-library/react";
import Route from "../routes/freelancerProfile";

jest.mock("../components/userProfile/FreelancerPage", () => () => (
  <p>page content</p>
));

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
