import { useEffect, useState } from "react";
import {
  createPool,
  addToPool,
  evaluatePool,
  getRoutes,
} from "../services/api";

export default function PoolingPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [poolId, setPoolId] = useState<number | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD ROUTES
  useEffect(() => {
    async function load() {
      try {
        const res = await getRoutes();
        setRoutes(res);
      } catch {
        alert("Failed to load routes ❌");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔥 SELECT ROUTE
  function toggleRoute(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((r) => r !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  // 🔥 CREATE POOL
  async function handleCreate() {
    try {
      const res = await createPool("My Pool");
      setPoolId(res.poolId);

      // add routes
      for (let r of selected) {
        await addToPool(res.poolId, r);
      }

      alert("Pool created ✅");
    } catch {
      alert("Create pool failed ❌");
    }
  }

  // 🔥 EVALUATE
  async function handleEvaluate() {
    try {
      const res = await evaluatePool(poolId);
      setResult(res);
    } catch {
      alert("Evaluation failed ❌");
    }
  }

  if (loading) {
    return <p className="text-center mt-5">Loading pooling...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pooling</h2>

      {/* 🔹 SELECT ROUTES */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Select Routes</h3>

        <div className="flex flex-wrap gap-2">
          {routes.map((r) => (
            <button
              key={r.routeId}
              onClick={() => toggleRoute(r.routeId)}
              className={`px-3 py-1 rounded border ${
                selected.includes(r.routeId)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {r.routeId}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 ACTIONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Pool
        </button>

        <button
          onClick={handleEvaluate}
          disabled={!poolId}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Evaluate
        </button>
      </div>

      {/* 🔹 RESULT */}
      {result && (
        <div>
          <div className="mb-4 p-4 rounded shadow bg-gray-100">
            <p>
              <strong>Total CB:</strong> {Math.round(result.totalCB)}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  result.totalCB >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {result.status}
              </span>
            </p>
          </div>

          {/* 🔹 TRANSFERS TABLE */}
          <table className="w-full border border-gray-300 shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {result.transfers.map((t: any, i: number) => (
                <tr key={i} className="text-center border-t">
                  <td className="p-2">{t.from}</td>
                  <td className="p-2">{t.to}</td>
                  <td className="p-2">
                    {Math.round(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}