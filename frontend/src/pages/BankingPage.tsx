import { useEffect, useState } from "react";
import {
  getRoutes,
  bankCredits,
  applyBank,
} from "../services/api";

export default function BankingPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD ROUTES + CB
  useEffect(() => {
    async function load() {
      try {
        const res = await getRoutes();
        setRoutes(res);
      } catch (err) {
        alert("Failed to load data ❌");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔥 BANK
  async function handleBank(routeId: string, year: number) {
    try {
      await bankCredits(routeId, year);
      alert("Banked successfully ✅");
    } catch (err) {
      alert("Bank failed ❌");
    }
  }

  // 🔥 APPLY
  async function handleApply(routeId: string, year: number) {
    try {
      const res = await applyBank(routeId, year);

      alert(
        `Applied: ${res.bankUsed}\nAfter CB: ${res.adjustedCB}`
      );
    } catch (err) {
      alert("Apply failed ❌");
    }
  }

  if (loading) {
    return <p className="text-center mt-5">Loading banking...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Banking</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Route</th>
              <th className="p-2">CB</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((r) => (
              <tr key={r.routeId} className="text-center border-t">
                <td className="p-2">{r.routeId}</td>

                <td
                  className={`p-2 font-semibold ${
                    r.totalEmissions > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {r.totalEmissions}
                </td>

                <td className="p-2 flex gap-2 justify-center">
                  {/* 🔥 BANK BUTTON */}
                  <button
                    onClick={() => handleBank(r.routeId, r.year)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Bank
                  </button>

                  {/* 🔥 APPLY BUTTON */}
                  <button
                    onClick={() => handleApply(r.routeId, r.year)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}