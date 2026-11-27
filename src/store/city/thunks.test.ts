import { fakeApi, makeStore } from "../../testUtils";
import { loadCities } from "../../store/city/thunks";

it("loads the cities of a country", async () => {
  const calls = fakeApi({ "POST countriesnow": [200, { data: ["Cluj"] }] });
  const result = await makeStore().dispatch(loadCities({ country: "Romania" }));
  expect(result.payload).toEqual({ cities: ["Cluj"] });
  expect(calls[0]?.data).toEqual({ country: "Romania" });
});

it("rejects with the error message", async () => {
  fakeApi({ "POST countriesnow": [500] });
  const result = await makeStore().dispatch(loadCities({ country: "Romania" }));
  expect(result.payload).toBe("Request failed with status code 500");
});
