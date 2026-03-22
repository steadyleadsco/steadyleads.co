import React from 'react';
import { DashboardLayout } from '@/components/Layout';
import { useDashboardMetrics } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function DashboardHome() {
  const { data: metricsData, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading metrics...</p>
        </div>
      </DashboardLayout>
    );
  }

  const metrics = metricsData?.data;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            label="Total Leads"
            value={metrics?.totalLeads ?? 0}
            trend="all time"
          />
          <MetricCard
            label="Leads This Month"
            value={metrics?.leadsThisMonth ?? 0}
            trend="this month"
          />
          <MetricCard
            label="Leads This Week"
            value={metrics?.leadsThisWeek ?? 0}
            trend="this week"
          />
          <MetricCard
            label="Conversion Rate"
            value={formatPercent(metrics?.conversionRate ?? 0)}
            isPercent
          />
          <MetricCard
            label="Active Clients"
            value={metrics?.activeClients ?? 0}
          />
          <MetricCard
            label="Total Revenue"
            value={formatCurrency(metrics?.totalRevenue ?? 0)}
            isCurrency
          />
        </div>

        {/* Pending Items */}
        {metrics && metrics.pendingApprovals > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-yellow-900 mb-2">
              ⚠️ {metrics.pendingApprovals} Pending Approvals
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              You have items awaiting approval.
            </p>
            <div className="flex gap-4">
              <a href="/dashboard/clients" className="btn-secondary text-sm">
                Review Clients
              </a>
              <a href="/dashboard/invoices" className="btn-secondary text-sm">
                Review Invoices
              </a>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/dashboard/clients" className="btn-secondary justify-center">
              View Clients
            </a>
            <a href="/dashboard/leads" className="btn-secondary justify-center">
              View Leads
            </a>
            <a href="/dashboard/invoices" className="btn-secondary justify-center">
              View Invoices
            </a>
            <a href="/dashboard/digest" className="btn-secondary justify-center">
              Daily Digest
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({
  label,
  value,
  trend,
  isPercent,
  isCurrency,
}: {
  label: string;
  value: string | number;
  trend?: string;
  isPercent?: boolean;
  isCurrency?: boolean;
}) {
  return (
    <div className="card p-6">
      <p className="text-sm text-slate-600 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold text-navy">{value}</div>
      </div>
      {trend && <p className="text-xs text-slate-500 mt-2">{trend}</p>}
    </div>
  );
}
