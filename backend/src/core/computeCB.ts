const TARGET = 89.3368;

export function computeCB(route: any) {
  const energy = route.fuelConsumption * 41000;

  const cb = (TARGET - route.ghgIntensity) * energy;

  return {
    routeId: route.routeId,
    year: route.year,
    ghgIntensity: route.ghgIntensity,
    energy,
    complianceBalance: Math.round(cb),
    status: cb >= 0 ? "Surplus" : "Deficit",
  };
}