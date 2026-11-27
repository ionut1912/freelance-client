import { render, screen } from "@testing-library/react";
import { lazy } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";

import RootLayout from "./root";

const renderChild = (element: React.ReactNode) =>
  render(
    <RouterProvider
      router={createMemoryRouter([
        { element: <RootLayout />, children: [{ index: true, element }] },
      ])}
    />,
  );

describe("<RootLayout />", () => {
  it("renders the matched page inside the main landmark", () => {
    renderChild("child");

    expect(screen.getByRole("main")).toHaveTextContent("child");
  });

  it("shows a loading message while the page is still loading", () => {
    const Never = lazy(() => new Promise<never>(() => {}));

    renderChild(<Never />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });
});
