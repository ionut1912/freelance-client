import reducer, {
  incrementFalseCount,
  resetFalseCount,
} from "../../store/face-verification/slice";
import { verifyCapturedFace } from "../../store/face-verification/thunks";

it("counts and resets failed attempts", () => {
  const once = reducer(undefined, incrementFalseCount());
  expect(once.falseCount).toBe(1);
  expect(reducer(once, resetFalseCount()).falseCount).toBe(0);
});

it("stores the result or the error", () => {
  expect(
    reducer(undefined, {
      type: verifyCapturedFace.fulfilled.type,
      payload: { isMatch: true },
    }).verifyFaceResult,
  ).toEqual({ isMatch: true });
  expect(
    reducer(undefined, {
      type: verifyCapturedFace.rejected.type,
      error: { message: "bad" },
    }).error,
  ).toBe("bad");
});
