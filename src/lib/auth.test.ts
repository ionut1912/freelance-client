import { api } from "../services/utils";
import { store } from "../store";
import { logout, setRole } from "../store/auth/slice";
import { reply } from "../testUtils/handlers";

import { isAuthenticated } from "./auth";

const signIn = () => {
  store.dispatch(setRole("Client"));
  localStorage.setItem("jwt", "abc");
};
const authed = () => api.get("thing", { headers: { "requires-auth": "" } });

afterEach(() => {
  store.dispatch(logout());
});

describe("isAuthenticated", () => {
  it("is false before anyone signs in", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("is false when only a role was chosen", () => {
    store.dispatch(setRole("Client"));

    expect(isAuthenticated()).toBe(false);
  });

  it("is false with a token but no role", () => {
    localStorage.setItem("jwt", "abc");

    expect(isAuthenticated()).toBe(false);
  });

  it("is true when signed in and false after logout", () => {
    signIn();
    expect(isAuthenticated()).toBe(true);

    store.dispatch(logout());
    expect(isAuthenticated()).toBe(false);
  });

  it("is false when the state cannot be read", () => {
    jest.spyOn(store, "getState").mockImplementation(() => {
      throw new Error("broken");
    });

    expect(isAuthenticated()).toBe(false);
  });
});

describe("expired session", () => {
  it("signs out when an authenticated request gets 401", async () => {
    signIn();
    reply("get", "thing", {}, 401);

    await expect(authed()).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(store.getState().auth.role).toBeNull();
    expect(localStorage.getItem("jwt")).toBeNull();
  });

  it.each([403, 500])("stays signed in on %i", async (status) => {
    signIn();
    reply("get", "thing", {}, status);

    await expect(authed()).rejects.toBeDefined();

    expect(isAuthenticated()).toBe(true);
  });

  it("ignores a 401 from a public request", async () => {
    signIn();
    reply("get", "thing", {}, 401);

    await expect(api.get("thing")).rejects.toBeDefined();

    expect(isAuthenticated()).toBe(true);
  });
});
