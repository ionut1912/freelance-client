import { render, screen } from "@testing-library/react";

import Spinner from "../../components/wrappers/Spinner";

it("shows a progress indicator", () => {
  render(<Spinner />);
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});
