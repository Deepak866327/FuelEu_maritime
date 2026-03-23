export interface RouteRepository {
  getAllRoutes(): Promise<any[]>;
  setBaseline(routeId: string): Promise<void>;
  saveCB(routeId: string, year: number, cb: number): Promise<void>;

  // 🔥 POOLING
  createPool(name: string): Promise<number>;
  addToPool(poolId: number, routeId: string): Promise<void>;
  getPoolRoutes(poolId: number): Promise<any[]>;

  // 🔥 BANKING
  bankSurplus(routeId: string, year: number, amount: number): Promise<void>;
  getBank(routeId: string, year: number): Promise<any[]>;

  // 🔥 STEP 5 (IMPORTANT)
  getTotalBank(routeId: string, year: number): Promise<number>;
  applyBank(routeId: string, year: number, amount: number): Promise<void>;
}