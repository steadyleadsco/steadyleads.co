import pool from '../db';
import { LandingPage, LandingPageCreate } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class LandingPageService {
  static async create(data: LandingPageCreate): Promise<LandingPage> {
    const id = uuidv4();
    const query = `
      INSERT INTO landing_pages (id, client_id, slug, title, city, service, status, template_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      id,
      data.client_id,
      data.slug,
      data.title || null,
      data.city || null,
      data.service || null,
      'draft',
      data.template_id || null,
    ]);
    return result.rows[0];
  }

  static async getById(id: string): Promise<LandingPage | null> {
    const query = 'SELECT * FROM landing_pages WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getBySlug(slug: string): Promise<LandingPage | null> {
    const query = 'SELECT * FROM landing_pages WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  static async getByClientId(clientId: string, limit = 50, offset = 0): Promise<LandingPage[]> {
    const query = 'SELECT * FROM landing_pages WHERE client_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
    const result = await pool.query(query, [clientId, limit, offset]);
    return result.rows;
  }

  static async getAll(limit = 50, offset = 0): Promise<LandingPage[]> {
    const query = 'SELECT * FROM landing_pages ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async update(id: string, data: Partial<LandingPageCreate>): Promise<LandingPage | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const updateableFields = ['title', 'city', 'service', 'status', 'template_id'];
    for (const field of updateableFields) {
      if (field in data && data[field as keyof LandingPageCreate] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field as keyof LandingPageCreate]);
        paramCount++;
      }
    }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    const query = `UPDATE landing_pages SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async publish(id: string): Promise<LandingPage | null> {
    const query = `
      UPDATE landing_pages SET status = 'published', published_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async archive(id: string): Promise<LandingPage | null> {
    const query = `
      UPDATE landing_pages SET status = 'archived'
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getStats(id: string): Promise<any> {
    const query = `
      SELECT
        lp.id,
        lp.slug,
        lp.title,
        COUNT(lps.id) as total_submissions,
        lp.form_captures,
        lp.published_at
      FROM landing_pages lp
      LEFT JOIN landing_page_submissions lps ON lp.id = lps.landing_page_id
      WHERE lp.id = $1
      GROUP BY lp.id, lp.slug, lp.title, lp.form_captures, lp.published_at;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}
