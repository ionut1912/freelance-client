import { routesLinks } from "../routes/index";

it("defines unique, absolute paths", () => {
  const paths = Object.values(routesLinks).filter((path) => path !== "*");
  expect(paths.every((path) => path.startsWith("/"))).toBe(true);
  expect(new Set(paths).size).toBe(paths.length);
});
