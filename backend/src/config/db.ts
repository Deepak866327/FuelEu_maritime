import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fuel_eu",
  password: "098765@", // ⚠️ jo tune install time pe set kiya
  port: 5432,
});

// 🔥 connection test
pool.connect()
  .then(() => console.log("DB connected ✅"))
  .catch(err => console.error("DB error ❌", err));