import { AxiosError, type AxiosAdapter, type AxiosResponse } from "axios";
import {
  createAuthAxios,
  getRoleFromToken,
  handleHttpError,
  navigateByRole,
} from "../utils/authUtils";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const tokenWith = (payload: object) =>
  `h.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.s`;
// Resolves with the outgoing request config instead of hitting the network.
const echo: AxiosAdapter = async (config) => ({
  data: null,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

afterEach(() => localStorage.clear());

describe("getRoleFromToken", () => {
  it("reads the role claim", () => {
    expect(getRoleFromToken(tokenWith({ [ROLE_CLAIM]: "Client" }))).toBe(
      "Client",
    );
    expect(getRoleFromToken(tokenWith({}))).toBeNull();
  });

  it("returns null for a malformed token", () => {
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(getRoleFromToken("garbage")).toBeNull();
    log.mockRestore();
  });
});

describe("createAuthAxios", () => {
  const api = createAuthAxios("https://api.test");
  const authed = () =>
    api.get("/a", { adapter: echo, headers: { "requires-auth": "" } });

  it("adds the bearer token only when auth is requested", async () => {
    localStorage.setItem("jwt", "abc");
    const withAuth = await authed();
    const without = await api.get("/b", { adapter: echo });
    expect(withAuth.config.headers.Authorization).toBe("Bearer abc");
    expect(withAuth.config.headers["requires-auth"]).toBeUndefined();
    expect(without.config.headers.Authorization).toBeUndefined();
  });

  it("sends no header without a stored token", async () => {
    expect((await authed()).config.headers.Authorization).toBeUndefined();
  });
});

describe("navigateByRole", () => {
  it.each([
    ["Client", "/client"],
    ["Freelancer", "/freelancer"],
    [null, "/"],
  ])("sends %s to %s", (role, path) => {
    const navigate = jest.fn();
    navigateByRole(role, navigate);
    expect(navigate).toHaveBeenCalledWith(path);
  });
});

describe("handleHttpError", () => {
  const failure = (message: string, data: object) =>
    new AxiosError(message, "ERR", undefined, undefined, {
      data,
    } as AxiosResponse);

  it("prefers the server message, then the error message", () => {
    expect(handleHttpError(failure("m", { message: "server" }))).toBe("server");
    expect(handleHttpError(failure("m", {}))).toBe("m");
    expect(handleHttpError(failure("", {}))).toBe(
      "An unexpected error occurred.",
    );
    expect(handleHttpError("x")).toBe("An unexpected error occurred.");
  });
});

it.each([null, undefined, ""])(
  "handleHttpError survives a response body of %p",
  (data) => {
    const error = new AxiosError("Failed", "ERR", undefined, undefined, {
      data,
    } as AxiosResponse);

    expect(handleHttpError(error)).toBe("Failed");
  },
);
