import reducer, {
  verifreelancerProfile,
  verifyClientProfile,
} from "../../store/user-profile/slice";
import * as thunks from "../../store/user-profile/thunks";
import { profile, profileState } from "../../testUtils";

it("starts in a loading state", () => {
  expect(reducer(undefined, { type: "@@init" }).loading).toBe(true);
});

it("stores loaded profiles", () => {
  const type = thunks.loadCurrentUserProfile.fulfilled.type;
  const loaded = reducer(undefined, {
    type,
    payload: { clientProfiles: [1], freelancerProfiles: [] },
  });
  expect(loaded.loading).toBe(false);
  expect(loaded.clientProfiles).toEqual([1]);
  expect(reducer(undefined, { type, payload: {} }).clientProfiles).toBeNull();
});

it("marks only the matching profile as verified", () => {
  const profiles = [profile({ isVerified: false }), profile({ id: 8 })];
  const state = profileState({
    clientProfiles: profiles,
    freelancerProfiles: profiles,
  }) as never;
  expect(
    reducer(state, verifyClientProfile(7)).clientProfiles?.[0]?.isVerified,
  ).toBe(true);
  expect(
    reducer(state, verifreelancerProfile(7)).freelancerProfiles?.[0]
      ?.isVerified,
  ).toBe(true);
});

it("ignores verification before profiles are loaded", () => {
  const initial = reducer(undefined, { type: "@@init" });
  expect(reducer(initial, verifyClientProfile(7))).toBe(initial);
  expect(reducer(initial, verifreelancerProfile(7))).toBe(initial);
});

it.each([
  thunks.saveClientProfile,
  thunks.saveFreelancerProfile,
  thunks.patchUserProfileAddress,
  thunks.patchImage,
])("records the error when %p is rejected", (thunk) => {
  const type = thunk.rejected.type;
  expect(reducer(undefined, { type, payload: "bad" }).error).toBe("bad");
  expect(reducer(undefined, { type }).error).toBeNull();
});

it("stops loading when the profile cannot be loaded", () => {
  const state = reducer(undefined, {
    type: "userProfile/loadCurrentUserProfile/rejected",
  });

  expect(state.loading).toBe(false);
  expect(state.clientProfiles).toBeNull();
});

describe("profile lifecycle", () => {
  const loaded = () =>
    reducer(undefined, {
      type: "userProfile/loadCurrentUserProfile/fulfilled",
      payload: { clientProfiles: [{ id: 1 }, { id: 2 }] },
    });

  it.each(["auth/logout", "auth/deleteCurrentUserAccount/fulfilled"])(
    "forgets the profile on %s",
    (type) => {
      expect(reducer(loaded(), { type })).toEqual(
        reducer(undefined, { type: "unknown" }),
      );
    },
  );

  it("removes only the deleted profile", () => {
    const state = reducer(loaded(), {
      type: "userProfile/deleteClientProfileSuccess",
      payload: 1,
    });

    expect(state.clientProfiles).toEqual([{ id: 2 }]);
  });

  it("stores a page of profiles", () => {
    const page = { items: [], totalCount: 0 };

    const state = reducer(undefined, {
      type: "userProfile/getUserProfilesSuccess",
      payload: page,
    });

    expect(state.paginatedUserProfiles).toEqual(page);
  });

  it.each([
    [undefined, true],
    [500, true],
    [404, false],
  ])("marks a load failing with %p as failed: %p", (payload, failed) => {
    const state = reducer(undefined, {
      type: "userProfile/loadCurrentUserProfile/rejected",
      payload,
    });

    expect(state.loadFailed).toBe(failed);
  });
});
