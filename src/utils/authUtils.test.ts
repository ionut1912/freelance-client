import { AxiosError, type AxiosResponse } from "axios";
import { buildToken } from "../testUtils/factories";
import { recordRequests, reply } from "../testUtils/handlers";
import {
  createAuthAxios,
  getRoleFromToken,
  handleHttpError,
  navigateByRole,
} from "./authUtils";

const FALLBACK = "An unexpected error occurred.";

const axiosError = (message: string, data?: unknown) =>
  new AxiosError(message, "ERR", undefined, undefined, {
    data,
  } as AxiosResponse);

describe("getRoleFromToken", () => {
  it.each(["Client", "Freelancer", "Администратор"])(
    "reads the role %s",
    (role) => {
      const token =
        role === "Администратор"
          ? `h.${Buffer.from(
              JSON.stringify({
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
                  role,
              }),
            ).toString("base64url")}.s`
          : buildToken(role);

      expect(getRoleFromToken(token)).toBe(role);
    },
  );

  it("returns null when there is no role claim", () => {
    expect(getRoleFromToken(buildToken())).toBeNull();
  });

  it.each(["", "garbage", "a.b.c", undefined as never])(
    "returns null for the malformed token %p",
    (token) => {
      jest.spyOn(console, "error").mockImplementation(() => {});

      expect(getRoleFromToken(token)).toBeNull();
    },
  );
});

describe("createAuthAxios", () => {
  const api = createAuthAxios("https://localhost:7020/api");
  const call = async (headers: Record<string, string> = {}) => {
    reply("get", "thing");
    const sent = recordRequests();
    const response = await api.get("/thing", { headers });
    return { response, request: sent[0] };
  };

  it("adds the bearer token when auth is requested", async () => {
    localStorage.setItem("jwt", "abc");

    const { request, response } = await call({ "requires-auth": "" });

    expect(request.authorization).toBe("Bearer abc");
    expect(response.config.headers["requires-auth"]).toBeUndefined();
  });

  it("sends no token on a public request", async () => {
    localStorage.setItem("jwt", "abc");

    const { request } = await call();

    expect(request.authorization).toBeNull();
  });

  it.each([null, ""])("sends no header for a stored token %p", async (jwt) => {
    if (jwt !== null) localStorage.setItem("jwt", jwt);

    const { request } = await call({ "requires-auth": "" });

    expect(request.authorization).toBeNull();
  });
});

describe("navigateByRole", () => {
  it.each([
    ["Client", "/client"],
    ["Freelancer", "/freelancer"],
    ["client", "/"],
    ["", "/"],
    [null, "/"],
  ])("sends the role %p to %s", (role, path) => {
    const navigate = jest.fn();

    navigateByRole(role, navigate);

    expect(navigate).toHaveBeenCalledWith(path);
  });
});

describe("handleHttpError", () => {
  it("prefers the server's message", () => {
    expect(handleHttpError(axiosError("m", { message: "server" }))).toBe(
      "server",
    );
  });

  it.each([{}, null, undefined, "", { message: "" }])(
    "falls back to the error message for the body %p",
    (data) => {
      expect(handleHttpError(axiosError("Failed", data))).toBe("Failed");
    },
  );

  it.each([axiosError(""), new Error("boom"), "x", null, undefined, 0])(
    "uses a generic message for %p",
    (error) => {
      expect(handleHttpError(error)).toBe(FALLBACK);
    },
  );
});
