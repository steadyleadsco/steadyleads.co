// Auth
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'staff';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Client
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  treatments: string[];
  status: 'active' | 'trial' | 'inactive' | 'pending-approval';
  monthlyLeadTarget: number;
  createdAt: string;
  updatedAt: string;
}

// Leads
export interface Lead {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  treatment: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'booked' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  booked: number;
  lost: number;
}

// Invoices
export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  dueDate: string;
  issueDate: string;
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Dashboard
export interface DashboardMetrics {
  totalLeads: number;
  leadsThisMonth: number;
  leadsThisWeek: number;
  conversionRate: number;
  activeClients: number;
  pendingApprovals: number;
  totalRevenue: number;
}

export interface DailyDigest {
  date: string;
  newLeads: number;
  contactedLeads: number;
  bookedLeads: number;
  topClients: ClientSummary[];
  pendingInvoices: Invoice[];
  upcomingEvents?: string[];
}

export interface ClientSummary {
  id: string;
  name: string;
  leadsThisMonth: number;
  conversionRate: number;
  status: string;
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
