import { salesData } from "./salesData";

it("has one numeric value per country code", () => {
  const ids = salesData.map((entry) => entry.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(salesData.every((e) => typeof e.value === "number")).toBe(true);
});
