import reducer from "../../store/country/slice";
import { loadCountries } from "../../store/country/thunks";

it("starts empty and loading", () => {
  expect(reducer(undefined, { type: "@@init" })).toEqual({
    countries: [],
    loading: true,
    error: null,
  });
});

it("stores the loaded countries", () => {
  const state = reducer(undefined, {
    type: loadCountries.fulfilled.type,
    payload: { countries: ["a"] },
  });
  expect(state).toEqual({ countries: ["a"], loading: false, error: null });
});

it("records a failure", () => {
  const state = reducer(undefined, {
    type: loadCountries.rejected.type,
    error: { message: "bad" },
  });
  expect(state.error).toBe("bad");
});
