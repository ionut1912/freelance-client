import { render, screen } from "@testing-library/react";

import PageHeader from "./PageHeader";

it("shows only the title by default", () => {
  render(<PageHeader title="Title" />);
  expect(screen.getByText("Title")).toBeInTheDocument();
  expect(screen.queryByLabelText("breadcrumb")).not.toBeInTheDocument();
});

it("shows breadcrumbs and right-hand content", () => {
  render(
    <PageHeader
      title="Title"
      breadcrumbs={["One"]}
      renderRight={<span>right</span>}
    />,
  );
  expect(screen.getByLabelText("breadcrumb")).toHaveTextContent("One");
  expect(screen.getByText("right")).toBeInTheDocument();
});
