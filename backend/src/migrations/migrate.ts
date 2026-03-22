import fs from 'fs';
import path from 'path';
import pool from '../db';

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../../migrations');
  
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    try {
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
      console.log(`✓ ${file} completed`);
    } catch (err) {
      console.error(`✗ Migration ${file} failed:`, err);
      process.exit(1);
    }
  }
  
  console.log('All migrations completed successfully');
  await pool.end();
  process.exit(0);
}

runMigrations();
