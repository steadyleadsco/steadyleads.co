import pool from '../db';
import { Lead, LeadCreate } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class LeadService {
  static async create(data: LeadCreate): Promise<Lead> {
    const id = uuidv4();
    const query = `
      INSERT INTO leads (id, client_id, name, email, phone, source, source_detail, quality_score, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      id,
      data.client_id,
      data.name || null,
      data.email || null,
      data.phone || null,
      data.source || null,
      data.source_detail || null,
      data.quality_score || 50,
      data.status || 'new',
    ]);
    return result.rows[0];
  }

  static async getById(id: string): Promise<Lead | null> {
    const query = 'SELECT * FROM leads WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getByClientId(clientId: string, limit = 50, offset = 0): Promise<Lead[]> {
    const query = 'SELECT * FROM leads WHERE client_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
    const result = await pool.query(query, [clientId, limit, offset]);
    return result.rows;
  }

  static async getAll(limit = 50, offset = 0): Promise<Lead[]> {
    const query = 'SELECT * FROM leads ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async update(id: string, data: Partial<LeadCreate>): Promise<Lead | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const updateableFields = ['name', 'email', 'phone', 'status', 'quality_score', 'conversion_status', 'notes'];
    for (const field of updateableFields) {
      if (field in data && data[field as keyof LeadCreate] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field as keyof LeadCreate]);
        paramCount++;
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    const query = `UPDATE leads SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async getDailySummary(): Promise<any> {
    const query = `
      SELECT
        CURRENT_DATE as date,
        COUNT(*) as total_new,
        COUNT(DISTINCT client_id) as unique_clients,
        source,
        COUNT(*) as count
      FROM leads
      WHERE DATE(created_at) = CURRENT_DATE
      GROUP BY source
      ORDER BY count DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getClientLeadsToday(clientId: string): Promise<Lead[]> {
    const query = `
      SELECT * FROM leads
      WHERE client_id = $1 AND DATE(created_at) = CURRENT_DATE
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [clientId]);
    return result.rows;
  }
}
