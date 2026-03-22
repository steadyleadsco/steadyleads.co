// Utility functions

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getStatusColor(
  status: string
): 'bg-green-100 text-green-800' | 'bg-blue-100 text-blue-800' | 'bg-yellow-100 text-yellow-800' | 'bg-red-100 text-red-800' | 'bg-gray-100 text-gray-800' {
  switch (status) {
    case 'active':
    case 'paid':
    case 'booked':
    case 'qualified':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'pending-approval':
    case 'contacted':
      return 'bg-blue-100 text-blue-800';
    case 'trial':
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'inactive':
    case 'overdue':
    case 'lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
