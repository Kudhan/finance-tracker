// libs/database.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL on Render — fall back to local DB if needed
const connectionString = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false } // Render requires SSL
    : false, // Local machines must NOT use SSL
});

// Optional: Test connection
pool.connect()
  .then(client => {
    console.log('✅ Connected to Postgres');
    client.release();
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
  });

export default pool;
