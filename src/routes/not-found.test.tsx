import { render, screen } from "@testing-library/react";
import Route from "../routes/not-found";

jest.mock("../components/errors/NotFound", () => () => <p>page content</p>);

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
