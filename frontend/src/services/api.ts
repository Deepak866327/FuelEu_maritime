const BASE_URL = "http://localhost:5000";

// ================= ROUTES =================

// ✅ GET ROUTES
export async function getRoutes() {
  const res = await fetch(`${BASE_URL}/routes`);
  if (!res.ok) throw new Error("API failed");
  return res.json();
}

// ✅ SET BASELINE
export async function setBaseline(routeId: string) {
  const res = await fetch(`${BASE_URL}/routes/${routeId}/baseline`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Baseline failed");
  return res.json();
}

// ================= COMPARISON =================

export async function getComparison() {
  const res = await fetch(`${BASE_URL}/routes/comparison`);
  if (!res.ok) throw new Error("Comparison API failed");
  return res.json();
}

// ================= CB =================

export async function getCB() {
  const res = await fetch(`${BASE_URL}/routes/cb`);
  if (!res.ok) throw new Error("CB API failed");
  return res.json();
}

// ================= BANKING =================

// ✅ BANK SURPLUS
export async function bankCredits(routeId: string, year: number) {
  const res = await fetch(`${BASE_URL}/routes/banking/bank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ routeId, year }),
  });

  if (!res.ok) throw new Error("Bank failed");
  return res.json();
}

// ✅ APPLY BANK
export async function applyBank(routeId: string, year: number) {
  const res = await fetch(`${BASE_URL}/routes/banking/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ routeId, year }),
  });

  if (!res.ok) throw new Error("Apply failed");
  return res.json();
}

// ✅ GET BANK RECORDS
export async function getBank(routeId: string, year: number) {
  const res = await fetch(
    `${BASE_URL}/routes/banking/records?routeId=${routeId}&year=${year}`
  );

  if (!res.ok) throw new Error("Fetch bank failed");
  return res.json();
}

// ================= POOLING =================

// ✅ CREATE POOL
export async function createPool(name: string) {
  const res = await fetch(`${BASE_URL}/routes/pooling/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Create pool failed");
  return res.json();
}

// ✅ ADD ROUTE TO POOL
export async function addToPool(poolId: number, routeId: string) {
  const res = await fetch(`${BASE_URL}/routes/pooling/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poolId, routeId }),
  });

  if (!res.ok) throw new Error("Add to pool failed");
  return res.json();
}

// ✅ EVALUATE POOL
export async function evaluatePool(poolId: number) {
  const res = await fetch(`${BASE_URL}/routes/pooling/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poolId }),
  });

  if (!res.ok) throw new Error("Evaluate failed");
  return res.json();
}