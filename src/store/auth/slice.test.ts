import reducer, { logout, setRole } from "../../store/auth/slice";
import {
  blockUserAccount,
  deleteCurrentUserAccount,
  loginUser,
  registerUser,
} from "../../store/auth/thunks";

const initial = { user: null, role: null, error: null };
const error = { message: "x" };

it("sets the role and clears it on logout", () => {
  localStorage.setItem("jwt", "abc");
  const withRole = reducer(undefined, setRole("Freelancer"));
  expect(withRole.role).toBe("Freelancer");
  expect(reducer(withRole, logout())).toEqual(initial);
  expect(localStorage.getItem("jwt")).toBeNull();
});

it("stores the user on login and clears it on account deletion", () => {
  const state = reducer(undefined, {
    type: loginUser.fulfilled.type,
    payload: { user: { username: "ana" }, role: "Client" },
  });
  expect(state.role).toBe("Client");
  expect(
    reducer(state, { type: deleteCurrentUserAccount.fulfilled.type }),
  ).toEqual(initial);
  expect(
    reducer(state, { type: loginUser.fulfilled.type, payload: null }).user,
  ).toBeNull();
});

it.each([registerUser, loginUser, blockUserAccount, deleteCurrentUserAccount])(
  "records the error when %p is rejected",
  (thunk) => {
    const type = thunk.rejected.type;
    expect(reducer(undefined, { type, payload: error }).error).toBe(error);
    expect(reducer(undefined, { type }).error).toBeNull();
  },
);
