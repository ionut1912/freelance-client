import { waitFor } from "@testing-library/react";

import reportWebVitals from "./reportWebVitals";

jest.mock("web-vitals", () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

it("reports every metric to the callback, and only with one", async () => {
  const vitals = jest.requireMock<Record<string, jest.Mock>>("web-vitals");
  reportWebVitals();
  // A plain function: jest.fn() is not `instanceof Function` in this environment.
  const callback = () => {};
  reportWebVitals(callback);
  await waitFor(() => expect(vitals.getTTFB).toHaveBeenCalled());
  for (const metric of Object.values(vitals)) {
    expect(metric.mock.calls).toEqual([[callback]]);
  }
});
