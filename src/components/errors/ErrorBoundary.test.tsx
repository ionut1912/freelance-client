import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import userEvent from "user-event-13";

import ErrorBoundary from "../../components/errors/ErrorBoundary";

// The shape react-router recognises as a route error response.
const routeError = (data: unknown) => ({
  status: 404,
  statusText: "Not Found",
  internal: false,
  data,
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

it.each([
  ["a route error", routeError(null), "Something went wrong"],
  ["a message", routeError({ message: "Gone" }), "Gone"],
  ["no message", routeError({ message: undefined }), "Something went wrong"],
  ["an exception", new Error("boom"), "Unexpected Error"],
])("explains %s and goes home", async (_name, thrown, text) => {
  const router = createMemoryRouter(
    [
      {
        path: "/boom",
        errorElement: <ErrorBoundary />,
        loader: () => {
          // Non-Error values are what this test is about.
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw thrown;
        },
        element: <p />,
      },
      { path: "/", element: <p>home</p> },
    ],
    { initialEntries: ["/boom"] },
  );
  render(<RouterProvider router={router} />);

  expect(await screen.findByText(text)).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Go Back Home" }));
  expect(await screen.findByText("home")).toBeInTheDocument();
});
