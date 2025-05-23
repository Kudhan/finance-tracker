// libs/database.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render Postgres SSL
  },
});

// Optional: Test connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Connected to Render Postgres');
    client.release();
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
  });
