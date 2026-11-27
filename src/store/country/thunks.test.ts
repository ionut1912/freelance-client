import axios, { AxiosError } from "axios";
import { fakeApi, makeStore } from "../../testUtils";
import { loadCountries } from "../../store/country/thunks";

it("maps countries to their common names", async () => {
  fakeApi({ "GET restcountries": [200, [{ name: { common: "Romania" } }]] });
  const result = await makeStore().dispatch(loadCountries());
  expect(result.payload).toEqual({ countries: ["Romania"] });
});

it("rejects with the HTTP error message", async () => {
  fakeApi({ "GET restcountries": [500] });
  const result = await makeStore().dispatch(loadCountries());
  expect(result.payload).toBe("Request failed with status code 500");
});

it("handles a malformed response", async () => {
  fakeApi({ "GET restcountries": [200, {}] });
  const result = await makeStore().dispatch(loadCountries());
  expect(result.payload).toBe("An unexpected error occurred");
});

it("uses a default message when the HTTP error has none", async () => {
  axios.defaults.adapter = () => Promise.reject(new AxiosError(""));
  const result = await makeStore().dispatch(loadCountries());
  expect(result.payload).toBe("An error occurred");
});
