import { render, screen } from "@testing-library/react";
import Route from "../routes/clientProfile";

jest.mock("../components/userProfile/ClientPage", () => () => (
  <p>page content</p>
));

it("renders its page", () => {
  render(<Route />);
  expect(screen.getByText("page content")).toBeInTheDocument();
});
