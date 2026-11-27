import { userStatsData } from "../../../../components/dashboard/Widget/user-stats/chartData";

it("has every series for every country", () => {
  expect(userStatsData.length).toBeGreaterThan(0);
  for (const row of userStatsData) {
    expect(Object.keys(row)).toEqual(
      expect.arrayContaining(["country", "hot dog", "burger", "sandwich"]),
    );
  }
});
