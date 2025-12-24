import pool from "../db";

// Appointment type definition
export interface Appointment {
  id: string;
  user_id: string;
  rto_office_id: string;
  purpose: string;
  appointment_date: Date;
  status: string;
  notes?: string;
  completed_by?: string;
  completed_at?: Date;
  created_at: Date;
  updated_at?: Date;
}

// Create a new appointment
export const createAppointment = async (
  user_id: string,
  rto_office_id: string,
  purpose: string,
  appointment_date: Date
): Promise<Appointment> => {
  const query = `
    INSERT INTO appointments (user_id, rto_office_id, purpose, appointment_date, status)
    VALUES ($1, $2, $3, $4, 'BOOKED')
    RETURNING *
  `;
  const values = [user_id, rto_office_id, purpose, appointment_date];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all appointments
export const getAllAppointments = async (): Promise<Appointment[]> => {
  const query = `SELECT * FROM appointments ORDER BY appointment_date DESC`;
  const result = await pool.query(query);
  return result.rows;
};

// Get appointments by user id
export const getAppointmentsByUser = async (user_id: string): Promise<Appointment[]> => {
  const query = `SELECT * FROM appointments WHERE user_id = $1 ORDER BY appointment_date DESC`;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

// Get appointments by RTO office
export const getAppointmentsByRtoOffice = async (rto_office_id: string): Promise<Appointment[]> => {
  const query = `SELECT * FROM appointments WHERE rto_office_id = $1 ORDER BY appointment_date DESC`;
  const result = await pool.query(query, [rto_office_id]);
  return result.rows;
};

// Get appointment by id
export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  const query = `SELECT * FROM appointments WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// Reschedule an appointment
export const rescheduleAppointment = async (
  id: string,
  newDate: Date
): Promise<Appointment | null> => {
  const query = `
    UPDATE appointments 
    SET appointment_date = $2, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1 AND status = 'BOOKED'
    RETURNING *
  `;
  const result = await pool.query(query, [id, newDate]);
  return result.rows[0] || null;
};

// Cancel an appointment
export const cancelAppointment = async (id: string): Promise<Appointment | null> => {
  const query = `
    UPDATE appointments 
    SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1 
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// Complete an appointment (Officer)
export const completeAppointment = async (
  id: string,
  completedBy: string,
  notes?: string
): Promise<Appointment | null> => {
  const query = `
    UPDATE appointments 
    SET status = 'COMPLETED', completed_by = $2, completed_at = CURRENT_TIMESTAMP, notes = $3, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1 AND status = 'BOOKED'
    RETURNING *
  `;
  const result = await pool.query(query, [id, completedBy, notes || null]);
  return result.rows[0] || null;
};
