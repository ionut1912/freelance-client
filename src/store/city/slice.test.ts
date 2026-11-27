import reducer from "./slice";
import { loadCities } from "./thunks";

const payload = { country: "RO" };
const pending = (id: string) => loadCities.pending(id, payload);
const done = (id: string, cities: string[]) =>
  loadCities.fulfilled({ cities }, id, payload);
const failed = (id: string, message: string) =>
  loadCities.rejected(null, id, payload, message);
const start = (id = "1") => reducer(undefined, pending(id));

describe("city slice", () => {
  it("starts empty and ignores unknown actions", () => {
    const state = reducer(undefined, { type: "unknown" });

    expect(state).toEqual({ cities: [], loading: true, error: null });
    expect(reducer(state, { type: "unknown" })).toBe(state);
  });

  it.each([[[]], [["Cluj"]], [Array.from({ length: 10000 }, String)]])(
    "stores the loaded cities (%#)",
    (cities) => {
      const state = reducer(start(), done("1", cities));

      expect(state.cities).toEqual(cities);
      expect(state.loading).toBe(false);
    },
  );

  it("drops the previous cities when a new request starts", () => {
    const loaded = reducer(start(), done("1", ["Cluj"]));

    const next = reducer(loaded, pending("2"));

    expect(next.cities).toEqual([]);
    expect(next.loading).toBe(true);
    expect(loaded.cities).toEqual(["Cluj"]);
  });

  it("ignores a late answer for an earlier request", () => {
    const second = reducer(start("1"), pending("2"));

    const state = reducer(
      reducer(second, done("2", ["Paris"])),
      done("1", ["Cluj"]),
    );

    expect(state.cities).toEqual(["Paris"]);
  });

  it("ignores a late failure for an earlier request", () => {
    const second = reducer(start("1"), pending("2"));

    const state = reducer(second, failed("1", "late"));

    expect(state.error).toBeNull();
    expect(state.loading).toBe(true);
  });

  it("stops loading and keeps the message on failure", () => {
    const state = reducer(start(), failed("1", "Network Error"));

    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });
});
