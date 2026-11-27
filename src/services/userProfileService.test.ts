import { fakeApi, offlineApi } from "../testUtils";
import * as service from "../services/userProfileService";
import { API_URL } from "../services/utils";

const endpoints = [
  {
    name: "getUserProfiles",
    call: () => service.getUserProfiles({ pageSize: 5, pageNumber: 2 }),
    method: "GET",
    path: "userProfiles?pageSize=5&pageNumber=2",
    body: undefined,
    isProtected: true,
  },
  {
    name: "getCurrentUserProfile",
    call: () => service.getCurrentUserProfile(),
    method: "GET",
    path: "current/userProfiles",
    body: undefined,
    isProtected: true,
  },
  {
    name: "updateUserProfileAddress",
    call: () =>
      service.updateUserProfileAddress({
        profileId: 4,
        address: { city: "Cluj" } as never,
      }),
    method: "PATCH",
    path: "userProfiles/address/4",
    body: { city: "Cluj" },
    isProtected: true,
  },
  {
    name: "verifyUserProfile",
    call: () => service.verifyUserProfile(4),
    method: "PATCH",
    path: "userProfiles/verify/4",
    body: {},
    isProtected: true,
  },
  {
    name: "deleteUserProfile",
    call: () => service.deleteUserProfile(4),
    method: "DELETE",
    path: "userProfiles/4",
    body: undefined,
    isProtected: true,
  },
  {
    name: "updateImage",
    call: () => service.updateImage("img"),
    method: "PATCH",
    path: "userProfiles",
    body: { image: "img" },
    isProtected: true,
  },
  {
    name: "updateUserData",
    call: () => service.updateUserData({ bio: "b" } as never),
    method: "PATCH",
    path: "userProfiles/userData",
    body: { bio: "b" },
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
