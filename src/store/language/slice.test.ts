import reducer from "../../store/language/slice";
import { loadLanguages } from "../../store/language/thunks";

it("starts empty and loading", () => {
  expect(reducer(undefined, { type: "@@init" })).toEqual({
    languages: [],
    loading: true,
    error: null,
  });
});

it("stores the loaded languages", () => {
  const state = reducer(undefined, {
    type: loadLanguages.fulfilled.type,
    payload: { languages: ["a"] },
  });
  expect(state).toEqual({ languages: ["a"], loading: false, error: null });
});

it("records a failure", () => {
  const state = reducer(undefined, {
    type: loadLanguages.rejected.type,
    error: { message: "bad" },
  });
  expect(state.error).toBe("bad");
});

it("stops loading and keeps the real message on failure", () => {
  const state = reducer(undefined, {
    type: loadLanguages.rejected.type,
    payload: "Network Error",
    error: { message: "Rejected" },
  });

  expect(state.loading).toBe(false);
  expect(state.error).toBe("Network Error");
});
