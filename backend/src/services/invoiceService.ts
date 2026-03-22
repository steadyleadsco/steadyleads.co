import pool from '../db';
import { Invoice, InvoiceCreate } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class InvoiceService {
  static async create(data: InvoiceCreate): Promise<Invoice> {
    const id = uuidv4();
    const query = `
      INSERT INTO invoices (id, client_id, amount, invoice_type, status, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      id,
      data.client_id,
      data.amount,
      data.invoice_type || 'monthly_retainer',
      'pending_approval',
      data.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ]);
    return result.rows[0];
  }

  static async getById(id: string): Promise<Invoice | null> {
    const query = 'SELECT * FROM invoices WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getByClientId(clientId: string, limit = 50, offset = 0): Promise<Invoice[]> {
    const query = 'SELECT * FROM invoices WHERE client_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
    const result = await pool.query(query, [clientId, limit, offset]);
    return result.rows;
  }

  static async getAll(limit = 50, offset = 0): Promise<Invoice[]> {
    const query = 'SELECT * FROM invoices ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async getPending(): Promise<Invoice[]> {
    const query = 'SELECT * FROM invoices WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, ['pending_approval']);
    return result.rows;
  }

  static async update(id: string, data: Partial<InvoiceCreate>): Promise<Invoice | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const updateableFields = ['amount', 'invoice_type', 'status', 'notes'];
    for (const field of updateableFields) {
      if (field in data && data[field as keyof InvoiceCreate] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field as keyof InvoiceCreate]);
        paramCount++;
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    const query = `UPDATE invoices SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async approve(id: string, approvedBy: string): Promise<Invoice | null> {
    const query = `
      UPDATE invoices SET status = 'approved', approved_by = $1, approved_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [approvedBy, id]);
    return result.rows[0] || null;
  }

  static async send(id: string): Promise<Invoice | null> {
    const query = `
      UPDATE invoices SET status = 'sent', sent_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}
