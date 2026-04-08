require('dotenv').config();
const { Pool } = require('pg');

// Use DATABASE_URL from environment or fallback (though fallback won't work in prod)
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' || connectionString?.includes('neon') ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  if (!connectionString) {
    console.warn("WARNING: DATABASE_URL is not set. Database initialization skipped.");
    return;
  }

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      transaction_date TIMESTAMP,
      account_id VARCHAR(255),
      target_account_id VARCHAR(255),
      amount NUMERIC,
      currency VARCHAR(10),
      transaction_type VARCHAR(50),
      is_anomaly BOOLEAN,
      anomaly_reason TEXT,
      investigation_status VARCHAR(50) DEFAULT 'pending',
      notes TEXT DEFAULT ''
    );
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('PostgreSQL database initialized successfully.');
  } catch (err) {
    console.error('Error initializing PostgreSQL database:', err.message);
  }
}

initDatabase();

module.exports = pool;
