-- Migration: Initial Schema
-- Description: Create core tables for Steady Leads (clients, leads, landing pages, invoices, audit log)
-- Version: 1
-- Created: 2026-03-22

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  business_type VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(2),
  monthly_budget DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_by VARCHAR(100),
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Client settings
CREATE TABLE client_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  callrail_account_id VARCHAR(255),
  callrail_phone_number VARCHAR(20),
  tracking_domain VARCHAR(255),
  form_tracking_enabled BOOLEAN DEFAULT true,
  email_notifications_enabled BOOLEAN DEFAULT true,
  weekly_report_day VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  source VARCHAR(50),
  source_detail VARCHAR(255),
  quality_score INT DEFAULT 50,
  status VARCHAR(50) DEFAULT 'new',
  conversion_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  contacted_at TIMESTAMP,
  converted_at TIMESTAMP,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Lead history
CREATE TABLE lead_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  status_from VARCHAR(50),
  status_to VARCHAR(50),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by VARCHAR(100),
  reason TEXT
);

-- Landing pages
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  city VARCHAR(100),
  service VARCHAR(100),
  form_captures INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft',
  template_id VARCHAR(100),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Landing page submissions
CREATE TABLE landing_page_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  treatment_interest VARCHAR(100),
  preferred_time VARCHAR(50),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  auto_created_lead BOOLEAN DEFAULT true,
  created_lead_id UUID REFERENCES leads(id)
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  invoice_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'draft',
  due_date DATE,
  sent_at TIMESTAMP,
  paid_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by VARCHAR(100),
  approved_at TIMESTAMP
);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(255),
  entity_type VARCHAR(100),
  entity_id UUID,
  actor VARCHAR(100),
  changes JSONB,
  approval_status VARCHAR(50),
  approved_by VARCHAR(100),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- Create indexes
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

CREATE INDEX idx_client_settings_client_id ON client_settings(client_id);

CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);

CREATE INDEX idx_lead_history_lead_id ON lead_history(lead_id);

CREATE INDEX idx_landing_pages_client_id ON landing_pages(client_id);
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);

CREATE INDEX idx_landing_page_submissions_landing_page_id ON landing_page_submissions(landing_page_id);

CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_entity_id ON audit_log(entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- Grants (ensure openclaw_dba can access all tables)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO openclaw_dba;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO openclaw_dba;
