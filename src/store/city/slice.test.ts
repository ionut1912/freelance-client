import reducer from "../../store/city/slice";
import { loadCities } from "../../store/city/thunks";

it("starts empty and loading", () => {
  expect(reducer(undefined, { type: "@@init" })).toEqual({
    cities: [],
    loading: true,
    error: null,
  });
});

it("stores the loaded cities", () => {
  const state = reducer(undefined, {
    type: loadCities.fulfilled.type,
    payload: { cities: ["a"] },
  });
  expect(state).toEqual({ cities: ["a"], loading: false, error: null });
});

it("records a failure", () => {
  const state = reducer(undefined, {
    type: loadCities.rejected.type,
    error: { message: "bad" },
  });
  expect(state.error).toBe("bad");
});

it("stops loading and keeps the real message on failure", () => {
  const state = reducer(undefined, {
    type: loadCities.rejected.type,
    payload: "Network Error",
    error: { message: "Rejected" },
  });

  expect(state.loading).toBe(false);
  expect(state.error).toBe("Network Error");
});
