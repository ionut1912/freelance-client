import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import routes from "./routes";
import { store } from "./store";
import { logout } from "./store/auth/slice";
import { buildProfile, buildToken } from "./testUtils/factories";
import { reply, replyLookups } from "./testUtils/handlers";

// Charts need real layout, which jsdom does not have.
jest.mock("@nivo/geo", () => ({ ResponsiveChoropleth: () => null }));
jest.mock("@nivo/bar", () => ({ ResponsiveBar: () => null }));

const visit = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
    </Provider>,
  );
  return { router, user: userEvent.setup() };
};

afterEach(() => {
  store.dispatch(logout());
});

// The first visit to a page compiles its lazy chunk, which can be slow.
const LAZY = { timeout: 10000 };

describe("routing", () => {
  it.each([
    ["/", "link", "Join as Client"],
    ["/login", "button", "Log In"],
    ["/register", "button", "Create Account"],
    ["/unauthorized", "heading", "Access denied"],
    ["/nowhere", "button", "Return Home"],
  ])("serves %s to anyone", async (path, role, name) => {
    visit(path);

    expect(await screen.findByRole(role, { name }, LAZY)).toBeInTheDocument();
  });

  it.each(["/client", "/freelancer", "/calendar", "/user-profile"])(
    "redirects a visitor from %s to login",
    async (path) => {
      reply("get", "current/userProfiles", {}, 401);

      const { router } = visit(path);

      expect(
        await screen.findByRole("button", { name: "Log In" }, LAZY),
      ).toBeInTheDocument();
      expect(router.state.location.pathname).toBe("/login");
    },
  );

  it("signs a client in and reaches the dashboard", async () => {
    reply("post", "auth/login", { token: buildToken("Client") });
    reply("get", "current/userProfiles", buildProfile());
    replyLookups();
    const { router, user } = visit("/login");

    await user.type(
      await screen.findByRole("textbox", { name: "Username" }, LAZY),
      "ana",
    );
    await user.type(screen.getByLabelText("Password"), "secret1");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(
      await screen.findByRole("heading", { name: "Dashboard" }, LAZY),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/client");
  });
});
