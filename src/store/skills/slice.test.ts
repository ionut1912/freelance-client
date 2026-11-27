import reducer from "../../store/skills/slice";
import { loadSkills } from "../../store/skills/thunks";

it("starts empty and loading", () => {
  expect(reducer(undefined, { type: "@@init" })).toEqual({
    skills: [],
    loading: true,
    error: null,
  });
});

it("stores the loaded skills", () => {
  const state = reducer(undefined, {
    type: loadSkills.fulfilled.type,
    payload: { skills: ["a"] },
  });
  expect(state).toEqual({ skills: ["a"], loading: false, error: null });
});

it("records a failure", () => {
  const state = reducer(undefined, {
    type: loadSkills.rejected.type,
    error: { message: "bad" },
  });
  expect(state.error).toBe("bad");
});

it("stops loading and keeps the real message on failure", () => {
  const state = reducer(undefined, {
    type: loadSkills.rejected.type,
    payload: "Network Error",
    error: { message: "Rejected" },
  });

  expect(state.loading).toBe(false);
  expect(state.error).toBe("Network Error");
});
