import { fakeApi, offlineApi } from "../testUtils";
import verifyFace from "../services/faceVerificationService";
import { API_URL } from "../services/utils";

const endpoints = [
  {
    name: "verifyFace",
    call: () => verifyFace({ faceBase64Image: "x" }),
    method: "POST",
    path: "verifyFace",
    body: { faceBase64Image: "x" },
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
