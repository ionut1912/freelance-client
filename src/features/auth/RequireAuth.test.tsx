import { render, screen } from "@testing-library/react";
import { use, type ReactNode } from "react";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";

import { store } from "../../store";
import { logout, setRole } from "../../store/auth/slice";
import { buildProfile } from "../../testUtils/factories";
import { offline, reply } from "../../testUtils/handlers";

import RequireAuth from "./RequireAuth";

// RequireAuth asks the real app store whether a role is set.
const renderGuard = (page: ReactNode = <p>secret</p>) =>
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          [
            {
              element: <RequireAuth />,
              children: [{ path: "/private", element: page }],
            },
            { path: "/login", element: <h1>login page</h1> },
          ],
          { initialEntries: ["/private"] },
        )}
      />
    </Provider>,
  );

afterEach(() => {
  store.dispatch(logout());
});

describe("<RequireAuth />", () => {
  // Runs first, while the store still has its initial loading state.
  it("redirects a visitor without waiting for a profile", async () => {
    reply("get", "current/userProfiles", {}, 401);

    renderGuard();

    expect(
      await screen.findByRole("heading", { name: "login page" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("shows the page inside the sidebar to a signed-in user", async () => {
    reply("get", "current/userProfiles", buildProfile());
    store.dispatch(setRole("Client"));
    localStorage.setItem("jwt", "abc");

    renderGuard();

    expect(await screen.findByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("secret");
  });

  it.each([404, 500])(
    "shows the page, not an endless spinner, on %i",
    async (status) => {
      reply("get", "current/userProfiles", {}, status);
      store.dispatch(setRole("Client"));
      localStorage.setItem("jwt", "abc");

      renderGuard();

      expect(await screen.findByText("secret")).toBeInTheDocument();
    },
  );

  it("shows the page when offline", async () => {
    offline("get", "current/userProfiles");
    store.dispatch(setRole("Freelancer"));
    localStorage.setItem("jwt", "abc");

    renderGuard();

    expect(await screen.findByText("secret")).toBeInTheDocument();
  });

  it("keeps the sidebar while a page is suspended", async () => {
    reply("get", "current/userProfiles", buildProfile());
    store.dispatch(setRole("Client"));
    localStorage.setItem("jwt", "abc");
    const never = new Promise<never>(() => {});
    const Waiting = () => use(never);

    renderGuard(<Waiting />);

    expect(await screen.findByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("progressbar"),
    );
  });
});
