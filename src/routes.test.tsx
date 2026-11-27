import routes, { router } from "./routes";

jest.mock("react-calendar", () => () => null);
jest.mock("@nivo/geo", () => ({ ResponsiveChoropleth: () => null }));
jest.mock("@nivo/bar", () => ({ ResponsiveBar: () => null }));

const lazyRoutes = routes.flatMap((route) => route.children ?? []);

it("registers every page", () => {
  expect(lazyRoutes.map((route) => route.path ?? "/")).toEqual([
    "/",
    "/register",
    "/login",
    "/remote-capture",
    "*",
    "/unauthorized",
    "/client",
    "/freelancer",
    "/calendar",
    "/user-profile",
  ]);
  expect(router.routes).toHaveLength(2);
});

it.each(lazyRoutes.map((route) => [route.path ?? "/", route] as const))(
  "lazy-loads the component for %s",
  async (_path, route) => {
    const load = route.lazy as () => Promise<{ Component: unknown }>;
    await expect(load()).resolves.toHaveProperty("Component");
  },
);
