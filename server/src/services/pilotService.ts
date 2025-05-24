import { pool } from '../config/db';

export interface Pilot {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export class PilotService {
  static async getAll(): Promise<Pilot[]> {
    const { rows } = await pool.query<Pilot>(`
      SELECT
        id,
        last_name,
        first_name,
        middle_name,
        email,
        phone,
        to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS created_at
      FROM public.pilot
      ORDER BY id
    `);
    return rows;
  }

  static async create(data: {
    lastName: string;
    firstName: string;
    middleName?: string;
    email?: string;
    phone?: string;
  }): Promise<Pilot> {
    const { lastName, firstName, middleName, email, phone } = data;
    const { rows } = await pool.query<Pilot>(`
      INSERT INTO public.pilot
        (last_name, first_name, middle_name, email, phone)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING
        id,
        last_name,
        first_name,
        middle_name,
        email,
        phone,
        to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') AS created_at
    `, [
      lastName,
      firstName,
      middleName ?? null,
      email ?? null,
      phone ?? null,
    ]);
    return rows[0];
  }
}
