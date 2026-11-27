import { toast } from "react-toastify";
import { fakeApi, makeStore, profile, profileState } from "../../testUtils";
import { verifyCapturedFace } from "../../store/face-verification/thunks";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

const navigate = jest.fn();
const verify = () =>
  verifyCapturedFace({
    faceVerificationRequest: { faceBase64Image: "x" },
    profile: profile() as never,
    navigate,
  });
const attempts = (falseCount: number) => ({
  verifyFaceResult: null,
  falseCount,
  error: null,
});

it.each(["Client", "Freelancer"] as const)(
  "verifies a matching %s",
  async (role) => {
    // jsdom reports window.location.reload as "not implemented".
    const log = jest.spyOn(console, "error").mockImplementation(() => {});
    const calls = fakeApi({ "POST verifyFace": [200, { isMatch: true }] });
    const store = makeStore({
      auth: { user: null, role, error: null },
      userProfile: profileState() as never,
    });
    const result = await store.dispatch(verify());
    expect(result.type).toContain("fulfilled");
    expect(calls.some((c) => c.url.includes("verify/7"))).toBe(true);
    log.mockRestore();
  },
);

it("rejects a match when the role is missing", async () => {
  fakeApi({ "POST verifyFace": [200, { isMatch: true }] });
  const result = await makeStore().dispatch(verify());
  expect(result.type).toContain("rejected");
});

it.each([
  [0, 1, []],
  [2, 3, ["POST auth/block/3"]],
  [8, 0, ["DELETE userProfiles/7", "DELETE auth/account/current"]],
])("handles a mismatch after %i failures", async (before, after, extra) => {
  const calls = fakeApi({ "POST verifyFace": [200, { isMatch: false }] });
  const store = makeStore({ faceVerification: attempts(before) });

  await store.dispatch(verify());

  expect(store.getState().faceVerification.falseCount).toBe(after);
  expect(
    calls.slice(1).map((c) => `${c.method} ${c.url.split("/api/")[1]}`),
  ).toEqual(extra);
  expect(toast.warning).toHaveBeenCalled();
});

it("deletes the account when no face is found", async () => {
  const calls = fakeApi({ "POST verifyFace": [404] });
  const result = await makeStore().dispatch(verify());
  expect(result.type).toContain("rejected");
  expect(calls.map((c) => c.method)).toEqual(["POST", "DELETE"]);
});
