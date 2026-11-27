import reducer, { logout, setRole } from "./slice";
import {
  blockUserAccount,
  deleteCurrentUserAccount,
  loginUser,
  registerUser,
} from "./thunks";

const initial = { user: null, role: null, error: null };
const signedIn = () => ({
  user: { username: "ana" } as never,
  role: "Client" as const,
  error: null,
});

describe("auth slice", () => {
  it("starts signed out and ignores unknown actions", () => {
    const state = reducer(undefined, { type: "unknown" });

    expect(state).toEqual(initial);
    expect(reducer(state, { type: "unknown" })).toBe(state);
  });

  it("sets the role without mutating the previous state", () => {
    const before = Object.freeze({ ...initial });

    const after = reducer(before, setRole("Freelancer"));

    expect(after.role).toBe("Freelancer");
    expect(before.role).toBeNull();
  });

  it("clears the session and token on logout", () => {
    localStorage.setItem("jwt", "abc");

    expect(reducer(signedIn(), logout())).toEqual(initial);
    expect(localStorage.getItem("jwt")).toBeNull();
  });

  it("stores the user and role on login", () => {
    const state = reducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: { user: { username: "ana" }, role: "Client" },
    });

    expect(state).toMatchObject({
      user: { username: "ana" },
      role: "Client",
      error: null,
    });
  });

  it("stores no user for an empty login result", () => {
    const state = reducer(signedIn(), {
      type: loginUser.fulfilled.type,
      payload: null,
    });

    expect(state.user).toBeNull();
  });

  it("clears the session and token when the account is deleted", () => {
    localStorage.setItem("jwt", "abc");

    const state = reducer(signedIn(), {
      type: deleteCurrentUserAccount.fulfilled.type,
    });

    expect(state).toEqual(initial);
    expect(localStorage.getItem("jwt")).toBeNull();
  });

  it.each([
    registerUser,
    loginUser,
    blockUserAccount,
    deleteCurrentUserAccount,
  ])("records the error, or null, when %p is rejected", (thunk) => {
    const type = thunk.rejected.type;
    const error = { message: "x" };

    expect(reducer(undefined, { type, payload: error }).error).toBe(error);
    expect(reducer(undefined, { type }).error).toBeNull();
  });
});
