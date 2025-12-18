// libs/database.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL on Render — fall back to local DB if needed
const connectionString =
  process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;

const pool = new Pool({
  connectionString,

  // REQUIRED for Supabase on Render
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  // 🔑 IMPORTANT: Force IPv4 (fixes ENETUNREACH on Render)
  family: 4,
});

// Test connection (safe)
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to Supabase PostgresQl");
    client.release();
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

export default pool;
