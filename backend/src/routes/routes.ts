import express from "express";
import { RouteRepoDB } from "../adapters/routeRepoDB";
import { computeCB } from "../core/computeCB";
import { computeComparison } from "../core/comparison";

const router = express.Router();
const repo = new RouteRepoDB();

// ✅ GET routes
router.get("/", async (req, res) => {
  try {
    const routes = await repo.getAllRoutes();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// ✅ baseline
router.post("/:routeId/baseline", async (req, res) => {
  try {
    await repo.setBaseline(req.params.routeId);
    res.json({ message: "Baseline set" });
  } catch (err) {
    res.status(500).json({ error: "Baseline failed" });
  }
});

// ✅ CB
router.get("/cb", async (req, res) => {
  try {
    const routes = await repo.getAllRoutes();

    const result = [];

    for (let r of routes) {
      const cbData = computeCB(r);

      await repo.saveCB(
        cbData.routeId,
        cbData.year,
        cbData.complianceBalance
      );

      result.push(cbData);
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "CB calculation failed" });
  }
});

// ✅ comparison
router.get("/comparison", async (req, res) => {
  try {
    const routes = await repo.getAllRoutes();
    const result = computeComparison(routes);
    res.json(result);
  } catch (err: any) {
    if (err.message === "No baseline") {
      return res.status(400).json({ error: "No baseline set" });
    }
    res.status(500).json({ error: "Comparison failed" });
  }
});

// ================= BANKING =================

// ✅ BANK SURPLUS
router.post("/banking/bank", async (req, res) => {
  try {
    const { routeId, year } = req.body || {};

    if (!routeId || !year) {
      return res.status(400).json({
        error: "routeId and year required"
      });
    }

    const routes = await repo.getAllRoutes();
    const route = routes.find(r => r.routeId === routeId);

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    const cbData = computeCB(route);

    if (cbData.complianceBalance <= 0) {
      return res.status(400).json({ error: "No surplus to bank" });
    }

    await repo.bankSurplus(
      routeId,
      year,
      cbData.complianceBalance
    );

    res.json({
      message: "Surplus banked successfully",
      amount: cbData.complianceBalance
    });

  } catch (err: any) {
    console.error("BANK ERROR:", err);

    res.status(500).json({
      error: "Banking failed",
      details: err.message
    });
  }
});

// ✅ GET BANK RECORDS
router.get("/banking/records", async (req, res) => {
  try {
    const { routeId, year } = req.query;

    if (!routeId || !year) {
      return res.status(400).json({
        error: "routeId and year required"
      });
    }

    const data = await repo.getBank(
      routeId as string,
      Number(year)
    );

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch bank failed" });
  }
});

router.post("/banking/apply", async (req, res) => {
  try {
    const { routeId, year } = req.body;

    if (!routeId || !year) {
      return res.status(400).json({ error: "routeId & year required" });
    }

    const routes = await repo.getAllRoutes();
    const route = routes.find(r => r.routeId === routeId);

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    const cbData = computeCB(route);
    const cb = cbData.complianceBalance;

    const bank = await repo.getTotalBank(routeId, year);

    let bankUsed = 0;
    let adjustedCB = cb;

    // 🔥 ONLY APPLY IF DEFICIT
    if (cb < 0 && bank > 0) {
      bankUsed = Math.min(Math.abs(cb), bank);
      adjustedCB = cb + bankUsed;

      await repo.applyBank(routeId, year, bankUsed);
    }

    res.json({
      routeId,
      originalCB: cb,
      bankAvailable: bank,
      bankUsed,
      adjustedCB,
      status: adjustedCB >= 0 ? "Compliant" : "Deficit"
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Apply bank failed" });
  }
});

router.post("/pooling/evaluate", async (req, res) => {
  try {
    const { poolId } = req.body;

    const routes = await repo.getPoolRoutes(poolId);

    const computed = routes.map(r => ({
      routeId: r.routeId,
      cb: computeCB(r).complianceBalance
    }));

    let surplus = computed.filter(r => r.cb > 0);
    let deficit = computed.filter(r => r.cb < 0);

    let transfers: any[] = [];

    // 🔥 greedy matching
    for (let d of deficit) {
      let needed = Math.abs(d.cb);

      for (let s of surplus) {
        if (s.cb <= 0) continue;

        const transfer = Math.min(s.cb, needed);

        if (transfer > 0) {
          transfers.push({
            from: s.routeId,
            to: d.routeId,
            amount: transfer
          });

          s.cb -= transfer;
          needed -= transfer;
        }

        if (needed === 0) break;
      }
    }

    const totalCB = computed.reduce((sum, r) => sum + r.cb, 0);

    res.json({
      poolId,
      totalCB,
      status: totalCB >= 0 ? "Compliant" : "Deficit",
      transfers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Pooling failed" });
  }
});

router.post("/pooling/create", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Pool name required" });
    }

    const poolId = await repo.createPool(name);

    res.json({
      message: "Pool created",
      poolId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create pool failed" });
  }
});

router.post("/pooling/add", async (req, res) => {
  try {
    const { poolId, routeId } = req.body;

    if (!poolId || !routeId) {
      return res.status(400).json({
        error: "poolId and routeId required"
      });
    }

    await repo.addToPool(poolId, routeId);

    res.json({
      message: "Route added to pool"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Add to pool failed" });
  }
});

export default router;