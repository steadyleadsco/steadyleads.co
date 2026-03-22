import useSWR from 'swr';
import type {
  User,
  Client,
  Lead,
  Invoice,
  DashboardMetrics,
  DailyDigest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generic fetcher for SWR
export const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const error = new Error('API Error');
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

// Auth API
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data: ApiResponse<{ token: string; user: User }> = await res.json();
  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token);
  }
  return data;
}

export async function logout() {
  localStorage.removeItem('authToken');
}

export function useAuth() {
  const { data, error, isLoading } = useSWR<User>(`${API_URL}/auth/me`, fetcher);
  return {
    user: data,
    isLoading,
    error,
    isAuthenticated: !!data,
  };
}

// Client APIs
export function useClients(page = 1, limit = 20) {
  return useSWR<PaginatedResponse<Client>>(
    `${API_URL}/clients?page=${page}&limit=${limit}`,
    fetcher
  );
}

export function useClient(id: string) {
  return useSWR<ApiResponse<Client>>(
    id ? `${API_URL}/clients/${id}` : null,
    fetcher
  );
}

export async function createClient(data: Partial<Client>) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateClient(id: string, data: Partial<Client>) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function approveClient(id: string) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_URL}/clients/${id}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Lead APIs
export function useLeads(clientId?: string, page = 1, limit = 50) {
  const query = new URLSearchParams();
  if (clientId) query.append('clientId', clientId);
  query.append('page', page.toString());
  query.append('limit', limit.toString());

  return useSWR<PaginatedResponse<Lead>>(
    `${API_URL}/leads?${query.toString()}`,
    fetcher
  );
}

export function useLead(id: string) {
  return useSWR<ApiResponse<Lead>>(
    id ? `${API_URL}/leads/${id}` : null,
    fetcher
  );
}

export async function createLead(data: Partial<Lead>) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateLead(id: string, data: Partial<Lead>) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_URL}/leads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Invoice APIs
export function useInvoices(clientId?: string, page = 1, limit = 20) {
  const query = new URLSearchParams();
  if (clientId) query.append('clientId', clientId);
  query.append('page', page.toString());
  query.append('limit', limit.toString());

  return useSWR<PaginatedResponse<Invoice>>(
    `${API_URL}/invoices?${query.toString()}`,
    fetcher
  );
}

export function useInvoice(id: string) {
  return useSWR<ApiResponse<Invoice>>(
    id ? `${API_URL}/invoices/${id}` : null,
    fetcher
  );
}

export async function approveInvoice(id: string) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_URL}/invoices/${id}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Dashboard APIs
export function useDashboardMetrics() {
  return useSWR<ApiResponse<DashboardMetrics>>(
    `${API_URL}/dashboard/metrics`,
    fetcher
  );
}

export function useDailyDigest(date?: string) {
  const query = date ? `?date=${date}` : '';
  return useSWR<ApiResponse<DailyDigest>>(
    `${API_URL}/dashboard/digest${query}`,
    fetcher
  );
}
