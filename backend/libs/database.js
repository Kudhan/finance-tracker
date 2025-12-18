// libs/database.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // ✅ REQUIRED for Supabase Pooler
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to Supabase Postgres");
    client.release();
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

export default pool;
