import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./root";

it("renders the matched child route", () => {
  const router = createMemoryRouter([
    { element: <RootLayout />, children: [{ index: true, element: "child" }] },
  ]);
  render(<RouterProvider router={router} />);
  expect(screen.getByRole("main")).toHaveTextContent("child");
});
