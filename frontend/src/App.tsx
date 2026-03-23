import { useState } from "react";
import RoutesPage from "./pages/RoutesPage";
import ComparePage from "./pages/ComparePage";
import CBPage from "./pages/CBPage";
import BankingPage from "./pages/BankingPage";
import PoolingPage from "./pages/PoolingPage";

function App() {
  const [activeTab, setActiveTab] = useState("routes");

  const tabs = [
    { key: "routes", label: "Routes" },
    { key: "compare", label: "Compare" },
    { key: "cb", label: "CB" },
    { key: "banking", label: "Banking" },
    { key: "pooling", label: "Pooling" },
  ];

  function renderPage() {
    switch (activeTab) {
      case "routes":
        return <RoutesPage />;
      case "compare":
        return <ComparePage />;
      case "cb":
        return <CBPage />;
      case "banking":
        return <BankingPage />;
      case "pooling":
        return <PoolingPage />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔷 Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🚢 Fuel EU Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded transition ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🔷 Content */}
      <div className="p-6">{renderPage()}</div>
    </div>
  );
}

export default App;