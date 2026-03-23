import { useEffect, useState } from "react";
import { getComparison } from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ComparePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getComparison();
        setData(res);
      } catch (err) {
        alert("Failed to load comparison ❌");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading comparison...</p>;
  }

  if (!data) {
    return <p className="text-center mt-5">No data available</p>;
  }

  // 🔥 chart data
  const chartData = [
    {
      name: data.baseline.routeId,
      ghg: data.baseline.ghgIntensity,
    },
    ...data.comparisons.map((r: any) => ({
      name: r.routeId,
      ghg: r.ghgIntensity,
    })),
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Compare Routes</h2>

      {/* 🔷 BASELINE */}
      <div className="mb-6 p-4 bg-blue-100 rounded shadow">
        <h3 className="font-bold mb-1">Baseline Route</h3>
        <p>
          <span className="font-semibold">{data.baseline.routeId}</span> — GHG:{" "}
          {data.baseline.ghgIntensity}
        </p>
      </div>

      {/* 📊 CHART */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="mb-2 font-semibold">GHG Intensity Comparison</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ghg" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Route</th>
              <th className="p-2">GHG</th>
              <th className="p-2">% Diff</th>
              <th className="p-2">Compliance</th>
            </tr>
          </thead>

          <tbody>
            {data.comparisons.map((r: any) => (
              <tr key={r.routeId} className="text-center border-t">
                <td className="p-2">{r.routeId}</td>

                <td className="p-2">{r.ghgIntensity}</td>

                <td
                  className={`p-2 font-semibold ${
                    r.percentDiff > 0
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {r.percentDiff.toFixed(2)}%
                </td>

                <td className="p-2">
                  {r.compliant ? (
                    <span className="text-green-600 font-bold">
                      ✔ Compliant
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">
                      ❌ Non-Compliant
                    </span>
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