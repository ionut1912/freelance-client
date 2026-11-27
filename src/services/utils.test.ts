const original = process.env.REACT_APP_API_BASE;

afterEach(() => {
  if (original === undefined) delete process.env.REACT_APP_API_BASE;
  else process.env.REACT_APP_API_BASE = original;
  jest.resetModules();
});

it.each([
  ["https://api.test/api", "https://api.test/api"],
  [undefined, ""],
])("builds the API url from REACT_APP_API_BASE=%s", async (base, expected) => {
  if (base === undefined) delete process.env.REACT_APP_API_BASE;
  else process.env.REACT_APP_API_BASE = base;
  jest.resetModules();

  const { API_URL, api } = await import("./utils");

  expect(API_URL).toBe(expected);
  expect(api.defaults.baseURL).toBe(expected);
});
