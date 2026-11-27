import { render, screen } from "@testing-library/react";

import FullPageMessage from "./FullPageMessage";

it("shows its content", () => {
  render(
    <FullPageMessage>
      <p>Nothing here</p>
    </FullPageMessage>,
  );

  expect(screen.getByText("Nothing here")).toBeInTheDocument();
});
