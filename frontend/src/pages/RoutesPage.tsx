import { useEffect, useState } from "react";
import { getRoutes, setBaseline } from "../services/api";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [vessel, setVessel] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");

  // 🔥 FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        const res = await getRoutes();
        setRoutes(res);
        setFiltered(res);
      } catch (err) {
        alert("Failed to load routes ❌");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔥 FILTER
  function applyFilters() {
    let data = [...routes];

    if (vessel) {
      data = data.filter((r) =>
        r.vesselType.toLowerCase().includes(vessel.toLowerCase())
      );
    }

    if (fuel) {
      data = data.filter((r) =>
        r.fuelType.toLowerCase().includes(fuel.toLowerCase())
      );
    }

    if (year) {
      data = data.filter((r) => r.year === Number(year));
    }

    setFiltered(data);
  }

  // 🔥 RESET
  function reset() {
    setFiltered(routes);
    setVessel("");
    setFuel("");
    setYear("");
  }

  // 🔥 BASELINE
  async function setBase(id: string) {
    try {
      await setBaseline(id);
      alert("Baseline set ✅");

      const res = await getRoutes();
      setRoutes(res);
      setFiltered(res);
    } catch (err) {
      alert("Failed to set baseline ❌");
    }
  }

  if (loading) {
    return <p className="text-center mt-5">Loading routes...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Routes</h2>

      {/* 🔍 FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Vessel"
          value={vessel}
          onChange={(e) => setVessel(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Fuel"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={applyFilters}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>

        <button
          onClick={reset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* 📋 TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Route</th>
              <th className="p-2">Vessel</th>
              <th className="p-2">Fuel</th>
              <th className="p-2">Year</th>
              <th className="p-2">GHG</th>
              <th className="p-2">Fuel (t)</th>
              <th className="p-2">Distance (km)</th>
              <th className="p-2">Emissions</th>
              <th className="p-2">Baseline</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.routeId} className="text-center border-t">
                <td className="p-2">{r.routeId}</td>
                <td className="p-2">{r.vesselType}</td>
                <td className="p-2">{r.fuelType}</td>
                <td className="p-2">{r.year}</td>
                <td className="p-2">{r.ghgIntensity}</td>
                <td className="p-2">{r.fuelConsumption}</td>
                <td className="p-2">{r.distance}</td>
                <td className="p-2">{r.totalEmissions}</td>

                <td className="p-2">
                  {r.isBaseline ? (
                    <span className="text-green-600 font-bold">
                      Baseline ✅
                    </span>
                  ) : (
                    <button
                      onClick={() => setBase(r.routeId)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Set
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}