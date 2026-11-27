import { toast } from "react-toastify";
import { fakeApi, makeStore } from "../../testUtils";
import * as thunks from "../../store/auth/thunks";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

const navigate = jest.fn();
const claims = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Client",
};
const token = `h.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.s`;
const credentials = { username: "ana", password: "secret1" };
const actions = [
  () => thunks.registerUser({ payload: {} as never, navigate }),
  () => thunks.blockUserAccount({ id: 1, navigate }),
  () => thunks.deleteUserAccount(1),
  () => thunks.deleteCurrentUserAccount({ navigate }),
];

afterEach(() => localStorage.clear());

it("logs in, stores the token and navigates by role", async () => {
  fakeApi({ "POST auth/login": [200, { token }] });
  const store = makeStore();
  await store.dispatch(thunks.loginUser({ payload: credentials, navigate }));
  expect(localStorage.getItem("jwt")).toBe(token);
  expect(store.getState().auth.role).toBe("Client");
  expect(navigate).toHaveBeenCalledWith("/client");
});

it("shows the backend error when login fails", async () => {
  fakeApi({ "POST auth/login": [401, { detail: "Bad credentials" }] });
  const store = makeStore();
  await store.dispatch(thunks.loginUser({ payload: credentials, navigate }));
  expect(toast.error).toHaveBeenCalledWith("Bad credentials");
  expect(store.getState().auth.role).toBeNull();
  expect(navigate).not.toHaveBeenCalled();
});

it("completes the account actions", async () => {
  fakeApi();
  const store = makeStore();
  for (const action of actions) {
    const result = await store.dispatch(action() as never);
    expect((result as { type: string }).type).toContain("fulfilled");
  }
  expect(navigate.mock.calls).toEqual([["/login"], ["/login"], ["/"]]);
});

it("rejects and reports errors", async () => {
  const fail: [number, object] = [500, { detail: "Server broke" }];
  fakeApi({ "POST /api": fail, "DELETE /api": fail });
  const store = makeStore();
  for (const action of actions) {
    const result = await store.dispatch(action() as never);
    expect((result as { type: string }).type).toContain("rejected");
  }
  expect(toast.error).toHaveBeenCalledTimes(actions.length);
});
