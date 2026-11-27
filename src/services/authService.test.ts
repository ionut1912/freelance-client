import * as service from "../services/authService";
import { API_URL } from "../services/utils";
import { fakeApi, offlineApi } from "../testUtils";

const endpoints = [
  {
    name: "register",
    call: () => service.register({ username: "ana" } as never),
    method: "POST",
    path: "auth/register",
    body: { username: "ana" },
    isProtected: false,
  },
  {
    name: "login",
    call: () => service.login({ username: "a", password: "b" }),
    method: "POST",
    path: "auth/login",
    body: { username: "a", password: "b" },
    isProtected: false,
  },
  {
    name: "blockAccount",
    call: () => service.blockAccount(4),
    method: "POST",
    path: "auth/block/4",
    body: {},
    isProtected: true,
  },
  {
    name: "deleteAccount",
    call: () => service.deleteAccount(4),
    method: "DELETE",
    path: "auth/account/4",
    body: undefined,
    isProtected: true,
  },
  {
    name: "deleteCurrentAccount",
    call: () => service.deleteCurrentAccount(),
    method: "DELETE",
    path: "auth/account/current",
    body: undefined,
    isProtected: true,
  },
];

beforeEach(() => localStorage.setItem("jwt", "abc"));
afterEach(() => localStorage.clear());

describe.each(endpoints)("$name", ({ call, method, path, ...endpoint }) => {
  it("sends the payload, with a token only if protected", async () => {
    const calls = fakeApi();

    const response = await call();

    expect(response.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ method, url: `${API_URL}/${path}` });
    expect(calls[0]?.data).toEqual(endpoint.body);
    expect(calls[0]?.authorization).toBe(
      endpoint.isProtected ? "Bearer abc" : undefined,
    );
  });

  it("sends no Authorization header when there is no token", async () => {
    localStorage.clear();
    const calls = fakeApi();

    await call();

    expect(calls[0]?.authorization).toBeUndefined();
  });

  it.each([400, 401, 403, 404, 500])("rejects on HTTP %i", async (status) => {
    fakeApi({ [`${method} ${path}`]: [status, { detail: "Nope" }] });

    await expect(call()).rejects.toMatchObject({
      response: { status, data: { detail: "Nope" } },
    });
  });

  it("rejects when the server is unreachable", async () => {
    offlineApi();

    await expect(call()).rejects.toMatchObject({ code: "ERR_NETWORK" });
  });
});
