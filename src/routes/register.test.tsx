import { render, screen } from "@testing-library/react";
import Route from "../routes/register";

jest.mock("../components/forms/RegisterForm", () => () => <p>page content</p>);

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
