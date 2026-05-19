import { Pool } from "pg";

type DonationRow = {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  amount: string | number;
  gotra_message: string | null;
  payment_id: string | null;
  order_id: string | null;
  payment_status: string;
  created_at: string;
};

declare global {
  // Reuse the pool across hot reloads in local dev.
  var __donationsDbPool: Pool | undefined;
  var __donationsTableReady: Promise<void> | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL environment variable.");
  }

  return databaseUrl;
}

function getPool() {
  if (!globalThis.__donationsDbPool) {
    globalThis.__donationsDbPool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalThis.__donationsDbPool;
}

async function ensureDonationsTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS donations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile TEXT NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      gotra_message TEXT,
      payment_id TEXT,
      order_id TEXT,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function ensureDbReady() {
  if (!globalThis.__donationsTableReady) {
    globalThis.__donationsTableReady = ensureDonationsTable();
  }

  await globalThis.__donationsTableReady;
}

export async function insertDonation(input: {
  full_name: string;
  email: string;
  mobile: string;
  amount: number;
  gotra_message: string | null;
  payment_id: string;
  order_id: string;
  payment_status: string;
}) {
  await ensureDbReady();

  await getPool().query(
    `
      INSERT INTO donations (
        full_name,
        email,
        mobile,
        amount,
        gotra_message,
        payment_id,
        order_id,
        payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      input.full_name,
      input.email,
      input.mobile,
      input.amount,
      input.gotra_message,
      input.payment_id,
      input.order_id,
      input.payment_status,
    ],
  );
}

export async function listDonations(): Promise<DonationRow[]> {
  await ensureDbReady();

  const result = await getPool().query<DonationRow>(
    `
      SELECT
        id,
        full_name,
        email,
        mobile,
        amount,
        gotra_message,
        payment_id,
        order_id,
        payment_status,
        created_at
      FROM donations
      ORDER BY created_at ASC
    `,
  );

  return result.rows;
}
