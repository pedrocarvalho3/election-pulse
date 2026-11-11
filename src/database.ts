import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A variável DATABASE_URL não foi configurada");
}

export const pool = new Pool({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 2_000,
  idleTimeoutMillis: 30_000,
});
