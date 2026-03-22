import { z } from 'zod';

// Client
export const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  business_type: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  monthly_budget: z.number().positive().optional(),
  created_by: z.string().optional(),
  notes: z.string().optional(),
});

export const ClientCreateSchema = ClientSchema.omit({ id: true, created_by: true }).extend({
  created_by: z.string().default('system'),
});

export const ClientUpdateSchema = ClientSchema.partial();

export type Client = z.infer<typeof ClientSchema>;
export type ClientCreate = z.infer<typeof ClientCreateSchema>;

// Lead
export const LeadSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.enum(['cold_email', 'contact_form', 'social', 'referral', 'other']).optional(),
  source_detail: z.string().optional(),
  quality_score: z.number().int().min(0).max(100).default(50),
  status: z.enum(['new', 'contacted', 'responded', 'qualified', 'converted', 'rejected']).default('new'),
  conversion_status: z.enum(['lead', 'consultation_booked', 'became_patient', 'no_conversion']).optional(),
  notes: z.string().optional(),
});

export const LeadCreateSchema = LeadSchema.omit({ id: true, status: true, conversion_status: true });

export const LeadUpdateSchema = LeadSchema.partial();

export type Lead = z.infer<typeof LeadSchema>;
export type LeadCreate = z.infer<typeof LeadCreateSchema>;

// Landing Page
export const LandingPageSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().optional(),
  city: z.string().optional(),
  service: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  template_id: z.string().optional(),
});

export const LandingPageCreateSchema = LandingPageSchema.omit({ id: true });

export const LandingPageUpdateSchema = LandingPageSchema.partial();

export type LandingPage = z.infer<typeof LandingPageSchema>;
export type LandingPageCreate = z.infer<typeof LandingPageCreateSchema>;

// Invoice
export const InvoiceSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  amount: z.number().positive(),
  invoice_type: z.enum(['setup', 'monthly_retainer', 'lead_overage', 'adjustment']).default('monthly_retainer'),
  status: z.enum(['draft', 'pending_approval', 'approved', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
  due_date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const InvoiceCreateSchema = InvoiceSchema.omit({ id: true, status: true, due_date: true }).extend({
  due_date: z.string().optional(),
});

export const InvoiceUpdateSchema = InvoiceSchema.partial();

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceCreate = z.infer<typeof InvoiceCreateSchema>;

// API Response
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};
