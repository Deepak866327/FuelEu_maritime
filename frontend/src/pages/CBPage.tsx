import { useEffect, useState } from "react";
import { getCB } from "../services/api";

type CBData = {
  routeId: string;
  ghgIntensity: number;
  energy: number;
  complianceBalance: number;
  status: string;
};

export default function CBPage() {
  const [data, setData] = useState<CBData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getCB();
        setData(res);
      } catch (err) {
        console.error("CB fetch error:", err);
        setError("Failed to load compliance data ❌");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Loading CB...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500 text-center">{error}</p>;
  }

  if (data.length === 0) {
    return <p className="p-4 text-center">No data available</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Compliance Balance (CB)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Route</th>
              <th className="p-2">GHG (gCO₂e/MJ)</th>
              <th className="p-2">Energy (MJ)</th>
              <th className="p-2">CB (gCO₂eq)</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r) => (
              <tr key={r.routeId} className="text-center border-t">
                <td className="p-2">{r.routeId}</td>

                <td className="p-2">{r.ghgIntensity}</td>

                <td className="p-2">
                  {r.energy.toLocaleString()}
                </td>

                {/* 🔥 CB VALUE */}
                <td
                  className={`p-2 font-semibold ${
                    r.complianceBalance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {r.complianceBalance.toLocaleString()}
                </td>

                {/* 🔥 STATUS */}
                <td
                  className={`p-2 font-bold ${
                    r.status === "Surplus"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}