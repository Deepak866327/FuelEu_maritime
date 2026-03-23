import { computeCB } from "../core/computeCB";

describe("Compute CB", () => {
  it("should return positive CB for low GHG", () => {
    const route = {
      routeId: "R001",
      ghgIntensity: 80,
      fuelConsumption: 1000,
      year: 2024
    };

    const res = computeCB(route);

    expect(res.complianceBalance).toBeGreaterThan(0);
  });

  it("should return negative CB for high GHG", () => {
    const route = {
      routeId: "R002",
      ghgIntensity: 100,
      fuelConsumption: 1000,
      year: 2024
    };

    const res = computeCB(route);

    expect(res.complianceBalance).toBeLessThan(0);
  });
});