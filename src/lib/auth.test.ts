import { isAuthenticated } from "../lib/auth";
import { store } from "../store";
import { logout, setRole } from "../store/auth/slice";

it("is true only while a role is set", () => {
  expect(isAuthenticated()).toBe(false);
  store.dispatch(setRole("Client"));
  expect(isAuthenticated()).toBe(true);
  store.dispatch(logout());
  expect(isAuthenticated()).toBe(false);
});

it("is false when the state cannot be read", () => {
  const spy = jest.spyOn(store, "getState").mockImplementation(() => {
    throw new Error("broken");
  });
  expect(isAuthenticated()).toBe(false);
  spy.mockRestore();
});
