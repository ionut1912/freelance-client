import { render, screen } from "@testing-library/react";
import Widget from "../../../components/dashboard/Widget/Widget";

it("shows the title and content", () => {
  render(<Widget title="Title">body</Widget>);
  expect(screen.getByText("Title")).toBeInTheDocument();
  expect(screen.getByText("body")).toBeInTheDocument();
});
