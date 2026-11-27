import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import RequireAuth from "../../components/auth/RequireAuth";
import { store } from "../../store";
import { logout, setRole } from "../../store/auth/slice";
import { fakeApi, profile } from "../../testUtils";

jest.mock(
  "../../components/sidebar/SideBarLayout",
  () =>
    ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sidebar">{children}</div>
    ),
);

// RequireAuth asks the real app store whether a role is set.
const renderGuard = () =>
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              element: <RequireAuth />,
              children: [{ path: "/private", element: <p>secret</p> }],
            },
            { path: "/login", element: <p>login page</p> },
          ],
          { initialEntries: ["/private"] },
        )}
      />
    </Provider>,
  );

afterEach(() => {
  store.dispatch(logout());
});

// Runs first, while the store still has its initial loading state.
it("redirects a logged-out visitor without waiting for a profile", async () => {
  fakeApi({ "GET current": [401] });
  renderGuard();
  expect(await screen.findByText("login page")).toBeInTheDocument();
});

it("shows the page, not an endless spinner, if the profile fails", async () => {
  fakeApi({ "GET current": [500] });
  store.dispatch(setRole("Client"));
  renderGuard();
  expect(await screen.findByText("secret")).toBeInTheDocument();
});

it("wraps the page in the sidebar for a signed-in user", async () => {
  fakeApi({ "GET current": [200, profile()] });
  store.dispatch(setRole("Client"));
  renderGuard();
  expect(await screen.findByTestId("sidebar")).toHaveTextContent("secret");
});

it("redirects a logged-out visitor once loading is done", async () => {
  fakeApi({ "GET current": [200, profile()] });
  renderGuard();
  expect(await screen.findByText("login page")).toBeInTheDocument();
});
