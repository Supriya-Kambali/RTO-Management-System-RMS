import pool from "../db";

// RTO Office type definition
export interface RtoOffice {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  address: string;
  phone?: string;
  email?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// Create a new RTO office
export const createRtoOffice = async (
  name: string,
  code: string,
  state: string,
  district: string,
  address: string,
  phone?: string,
  email?: string
): Promise<RtoOffice> => {
  const query = `
    INSERT INTO rto_offices (name, code, state, district, address, phone, email)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [name, code, state, district, address, phone || null, email || null];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all RTO offices
export const getAllRtoOffices = async (): Promise<RtoOffice[]> => {
  const query = `SELECT * FROM rto_offices WHERE status = 'ACTIVE' ORDER BY state, district`;
  const result = await pool.query(query);
  return result.rows;
};

// Get RTO office by ID
export const getRtoOfficeById = async (id: string): Promise<RtoOffice | null> => {
  const query = `SELECT * FROM rto_offices WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// Update RTO office
export const updateRtoOffice = async (
  id: string,
  data: { name?: string; address?: string; phone?: string; email?: string }
): Promise<RtoOffice | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.name) { fields.push(`name = $${paramCount++}`); values.push(data.name); }
  if (data.address) { fields.push(`address = $${paramCount++}`); values.push(data.address); }
  if (data.phone) { fields.push(`phone = $${paramCount++}`); values.push(data.phone); }
  if (data.email) { fields.push(`email = $${paramCount++}`); values.push(data.email); }

  if (fields.length === 0) return getRtoOfficeById(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const query = `UPDATE rto_offices SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// Delete RTO office (soft delete)
export const deleteRtoOffice = async (id: string): Promise<boolean> => {
  const query = `UPDATE rto_offices SET status = 'INACTIVE', updated_at = NOW() WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
};
