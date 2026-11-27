import { toast } from "react-toastify";
import { fakeApi, makeStore, profile } from "../../testUtils";
import type { UserRole } from "../../models/UserProfile";
import * as thunks from "../../store/user-profile/thunks";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

const fail: [number, object] = [500, { detail: "Server broke" }];
const auth = (role: UserRole) => ({ user: null, role, error: null });
const saves = [
  () => thunks.patchImage("data"),
  () => thunks.saveClientProfile({} as never),
  () => thunks.saveFreelancerProfile({} as never),
  () => thunks.patchUserData({} as never),
  () => thunks.patchUserProfileAddress({ profileId: 7 } as never),
  () => thunks.patchFreelancerData({ profileId: 7 } as never),
];

it("saves and shows a success message", async () => {
  fakeApi();
  const store = makeStore();
  for (const save of saves) await store.dispatch(save() as never);
  expect(toast.success).toHaveBeenCalledTimes(saves.length);
});

it("shows the backend error when saving fails", async () => {
  fakeApi({ "PATCH /api": fail, "POST /api": fail });
  const store = makeStore();
  for (const save of saves) await store.dispatch(save() as never);
  expect(toast.error).toHaveBeenCalledTimes(saves.length);
  expect(store.getState().userProfile.error).not.toBeNull();
});

it.each([
  ["Client", "clientProfiles"],
  ["Freelancer", "freelancerProfiles"],
] as const)("loads the current %s profile", async (role, key) => {
  fakeApi({ "GET current": [200, profile()] });
  const store = makeStore({ auth: auth(role) });
  await store.dispatch(thunks.loadCurrentUserProfile() as never);
  expect(store.getState().userProfile[key]).toHaveLength(1);
});

it("loads empty lists without a role", async () => {
  fakeApi();
  const store = makeStore();
  await store.dispatch(thunks.loadCurrentUserProfile() as never);
  expect(store.getState().userProfile.clientProfiles).toEqual([]);
});

it.each(["Client", "Freelancer"] as const)(
  "removes a %s profile",
  async (role) => {
    const calls = fakeApi();
    const store = makeStore({ auth: auth(role) });
    await store.dispatch(thunks.removeUserProfile(7) as never);
    expect(calls[0]?.method).toBe("DELETE");
  },
);

it("lists profiles", async () => {
  fakeApi();
  const result = await makeStore().dispatch(
    thunks.getUserProfilesData({ pageSize: 1, pageNumber: 1 }),
  );
  expect(result.type).toContain("fulfilled");
});

it("rejects when removing or listing fails", async () => {
  fakeApi({ "DELETE /api": fail, "GET /api": fail });
  const store = makeStore();
  const removed = (await store.dispatch(
    thunks.removeUserProfile(7) as never,
  )) as { type: string };
  const listed = await store.dispatch(
    thunks.getUserProfilesData({ pageSize: 1, pageNumber: 1 }),
  );
  expect(removed.type).toContain("rejected");
  expect(listed.type).toContain("rejected");
});
