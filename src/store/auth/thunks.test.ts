import { buildToken } from "../../testUtils/factories";
import { offline, recordRequests, reply } from "../../testUtils/handlers";
import { makeStore } from "../../testUtils";
import {
  blockUserAccount,
  deleteCurrentUserAccount,
  deleteUserAccount,
  loginUser,
  registerUser,
} from "./thunks";

const navigate = jest.fn();
const credentials = { username: "ana", password: "secret1" };
const registration = { ...credentials, role: "Client" } as never;

const actions = [
  {
    name: "registerUser",
    run: () => registerUser({ payload: registration, navigate }),
    method: "post" as const,
    path: "auth/register",
    goesTo: "/login",
  },
  {
    name: "blockUserAccount",
    run: () => blockUserAccount({ id: 1, navigate }),
    method: "post" as const,
    path: "auth/block/1",
    goesTo: "/login",
  },
  {
    name: "deleteUserAccount",
    run: () => deleteUserAccount(1),
    method: "delete" as const,
    path: "auth/account/1",
    goesTo: undefined,
  },
  {
    name: "deleteCurrentUserAccount",
    run: () => deleteCurrentUserAccount({ navigate }),
    method: "delete" as const,
    path: "auth/account/current",
    goesTo: "/",
  },
];

beforeEach(() => navigate.mockClear());

describe("loginUser", () => {
  it("stores the token and role, then navigates", async () => {
    const token = buildToken("Freelancer");
    reply("post", "auth/login", { token });
    const store = makeStore();

    await store.dispatch(loginUser({ payload: credentials, navigate }));

    expect(localStorage.getItem("jwt")).toBe(token);
    expect(store.getState().auth.role).toBe("Freelancer");
    expect(navigate).toHaveBeenCalledWith("/freelancer");
  });

  it("goes home when the token carries no role", async () => {
    reply("post", "auth/login", { token: buildToken() });
    const store = makeStore();

    await store.dispatch(loginUser({ payload: credentials, navigate }));

    expect(store.getState().auth.role).toBeNull();
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it.each([400, 401, 403, 404, 500])(
    "records the error and stores nothing on HTTP %i",
    async (status) => {
      reply("post", "auth/login", { detail: "No" }, status);
      const store = makeStore();

      await store.dispatch(loginUser({ payload: credentials, navigate }));

      expect(store.getState().auth.error).not.toBeNull();
      expect(localStorage.getItem("jwt")).toBeNull();
      expect(navigate).not.toHaveBeenCalled();
    },
  );
});

describe.each(actions)("$name", ({ run, method, path, goesTo }) => {
  it("calls its endpoint and fulfils", async () => {
    reply(method, path);
    const sent = recordRequests();

    const result = await makeStore().dispatch(run() as never);

    expect((result as { type: string }).type).toMatch(/fulfilled$/);
    expect(sent.map((r) => r.path)).toEqual([path]);
    expect(navigate.mock.calls).toEqual(goesTo ? [[goesTo]] : []);
  });

  it.each([401, 500])("rejects without navigating on %i", async (status) => {
    reply(method, path, { detail: "Server broke" }, status);

    const result = await makeStore().dispatch(run() as never);

    expect((result as { type: string }).type).toMatch(/rejected$/);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("rejects when offline", async () => {
    offline(method, path);

    const result = await makeStore().dispatch(run() as never);

    expect((result as { type: string }).type).toMatch(/rejected$/);
  });
});
