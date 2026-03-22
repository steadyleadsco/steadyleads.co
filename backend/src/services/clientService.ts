import pool from '../db';
import { Client, ClientCreate } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ClientService {
  static async create(data: ClientCreate): Promise<Client> {
    const id = uuidv4();
    const query = `
      INSERT INTO clients (id, name, email, phone, business_type, city, state, monthly_budget, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      id,
      data.name,
      data.email,
      data.phone || null,
      data.business_type || null,
      data.city || null,
      data.state || null,
      data.monthly_budget || null,
      data.created_by || 'system',
    ]);
    return result.rows[0];
  }

  static async getById(id: string): Promise<Client | null> {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getByEmail(email: string): Promise<Client | null> {
    const query = 'SELECT * FROM clients WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async getAll(limit = 50, offset = 0): Promise<Client[]> {
    const query = 'SELECT * FROM clients ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async update(id: string, data: Partial<ClientCreate>): Promise<Client | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const updateableFields = ['name', 'phone', 'business_type', 'city', 'state', 'monthly_budget', 'notes'];
    for (const field of updateableFields) {
      if (field in data && data[field as keyof ClientCreate] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field as keyof ClientCreate]);
        paramCount++;
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    const query = `UPDATE clients SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async approve(id: string): Promise<Client | null> {
    const query = `
      UPDATE clients SET status = 'approved', approved_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getStats(id: string): Promise<any> {
    const query = `
      SELECT
        c.id,
        c.name,
        COUNT(l.id) as total_leads,
        SUM(CASE WHEN l.conversion_status = 'became_patient' THEN 1 ELSE 0 END) as converted_leads,
        c.monthly_budget
      FROM clients c
      LEFT JOIN leads l ON c.id = l.client_id
      WHERE c.id = $1
      GROUP BY c.id, c.name, c.monthly_budget;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}
