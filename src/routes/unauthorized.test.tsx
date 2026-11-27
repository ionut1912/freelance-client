import { render, screen } from "@testing-library/react";
import Route from "../routes/unauthorized";

jest.mock("../components/auth/Unauthoized", () => () => <p>page content</p>);

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
