import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders the heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Tailwind × React 19 × TS",
  );
});
