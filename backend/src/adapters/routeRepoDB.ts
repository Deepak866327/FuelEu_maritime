import { pool } from "../config/db";
import { RouteRepository } from "../ports/routeRepository";

export class RouteRepoDB implements RouteRepository {

  // ✅ GET ALL ROUTES
  async getAllRoutes() {
    const result = await pool.query("SELECT * FROM routes");

    return result.rows.map((r: any) => ({
      routeId: r.route_id,
      vesselType: r.vessel_type,
      fuelType: r.fuel_type,
      year: r.year,
      ghgIntensity: r.ghg_intensity,
      fuelConsumption: r.fuel_consumption,
      distance: r.distance,
      totalEmissions: r.total_emissions,
      isBaseline: r.is_baseline,
    }));
  }

  // ✅ SET BASELINE
  async setBaseline(routeId: string) {
    await pool.query("UPDATE routes SET is_baseline = false");

    const result = await pool.query(
      "UPDATE routes SET is_baseline = true WHERE route_id = $1 RETURNING *",
      [routeId]
    );

    if (result.rowCount === 0) {
      throw new Error("Route not found");
    }
  }

  // ✅ SAVE CB
  async saveCB(routeId: string, year: number, cb: number) {
    await pool.query(
      `INSERT INTO ship_compliance (route_id, year, cb_gco2eq) 
       VALUES ($1, $2, $3)`,
      [routeId, year, cb]
    );
  }

  // ✅ BANK SURPLUS
  async bankSurplus(routeId: string, year: number, amount: number) {
    await pool.query(
      `INSERT INTO bank_entries (route_id, year, amount_gco2eq) 
       VALUES ($1, $2, $3)`,
      [routeId, year, amount]
    );
  }

  // ✅ GET BANK RECORDS
  async getBank(routeId: string, year: number) {
    const result = await pool.query(
      `SELECT * FROM bank_entries 
       WHERE route_id = $1 AND year = $2`,
      [routeId, year]
    );

    return result.rows;
  }

  // ✅ GET TOTAL BANK
  async getTotalBank(routeId: string, year: number): Promise<number> {
    const result = await pool.query(
      `SELECT COALESCE(SUM(amount_gco2eq), 0) as total 
       FROM bank_entries 
       WHERE route_id = $1 AND year = $2`,
      [routeId, year]
    );

    return Number(result.rows[0].total) || 0;
  }

  // ✅ APPLY BANK
  async applyBank(routeId: string, year: number, amount: number): Promise<void> {
    await pool.query(
      `INSERT INTO bank_entries (route_id, year, amount_gco2eq) 
       VALUES ($1, $2, $3)`,
      [routeId, year, -amount]
    );
  }

  // ===========================
  // 🔥 POOLING METHODS
  // ===========================

  // ✅ CREATE POOL
  async createPool(name: string): Promise<number> {
    const result = await pool.query(
      "INSERT INTO pools (name) VALUES ($1) RETURNING id",
      [name]
    );
    return result.rows[0].id;
  }

  // ✅ ADD ROUTE TO POOL
  async addToPool(poolId: number, routeId: string) {
    await pool.query(
      "INSERT INTO pool_members (pool_id, route_id) VALUES ($1, $2)",
      [poolId, routeId]
    );
  }

  // ✅ GET POOL ROUTES
  async getPoolRoutes(poolId: number) {
    const result = await pool.query(
      `SELECT r.* FROM routes r
       JOIN pool_members pm ON r.route_id = pm.route_id
       WHERE pm.pool_id = $1`,
      [poolId]
    );

    return result.rows.map((r: any) => ({
      routeId: r.route_id,
      vesselType: r.vessel_type,
      fuelType: r.fuel_type,
      year: r.year,
      ghgIntensity: r.ghg_intensity,
      fuelConsumption: r.fuel_consumption,
      distance: r.distance,
      totalEmissions: r.total_emissions,
      isBaseline: r.is_baseline,
    }));
  }
}