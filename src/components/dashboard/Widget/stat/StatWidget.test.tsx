import { render, screen } from "@testing-library/react";

import StatWidget from "../../../../components/dashboard/Widget/stat/StatWidget";

it("shows the value and an optional footer", () => {
  const { rerender } = render(
    <StatWidget title="Users" value="10" footerText="Month" />,
  );
  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("Month")).toBeInTheDocument();
  rerender(<StatWidget title="Users" value="10" />);
  expect(screen.queryByText("Month")).not.toBeInTheDocument();
});
