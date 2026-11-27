import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { useAddressData } from "../hooks/useAddressData";
import { fakeApi, makeStore } from "../testUtils";

const setup = (country?: string) => {
  const calls = fakeApi({
    "GET restcountries": [200, [{ name: { common: "Romania" } }]],
    "POST countriesnow": [200, { data: ["Cluj"] }],
  });
  const store = makeStore();
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  return { calls, ...renderHook(() => useAddressData(country), { wrapper }) };
};

it("loads only countries when no country is chosen", async () => {
  const { result, calls } = setup();
  await waitFor(() => expect(result.current.countries).toEqual(["Romania"]));
  expect(calls).toHaveLength(1);
});

it("loads the cities of the chosen country", async () => {
  const { result } = setup("Romania");
  await waitFor(() => expect(result.current.cities).toEqual(["Cluj"]));
});
