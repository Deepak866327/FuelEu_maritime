export function computeComparison(routes: any[]) {
  const baseline = routes.find(r => r.isBaseline);

  if (!baseline) throw new Error("No baseline");

  const comparisons = routes
    .filter(r => r.routeId !== baseline.routeId)
    .map(r => {
      const percentDiff =
        ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;

      return {
        routeId: r.routeId,
        ghgIntensity: r.ghgIntensity,
        percentDiff: Number(percentDiff.toFixed(2)),
        compliant: r.ghgIntensity <= 89.3368
      };
    });

  // 🔥 IMPORTANT FIX
  return {
    baseline,
    comparisons
  };
}