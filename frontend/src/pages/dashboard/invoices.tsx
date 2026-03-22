import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { useInvoices, useClients, approveInvoice } from '@/lib/api';
import { formatDate, formatCurrency, getStatusColor, capitalizeFirst } from '@/lib/utils';

export default function InvoicesPage() {
  const [clientId, setClientId] = useState<string>('');
  const { data: invoicesData, isLoading: invoicesLoading, mutate } = useInvoices(clientId);
  const { data: clientsData, isLoading: clientsLoading } = useClients(1, 100);

  const invoices = invoicesData?.data || [];
  const clients = clientsData?.data || [];

  const handleApprove = async (invoiceId: string) => {
    try {
      await approveInvoice(invoiceId);
      mutate();
    } catch (err) {
      console.error('Error approving invoice:', err);
    }
  };

  if (invoicesLoading || clientsLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading invoices...</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">Invoices</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <p className="text-sm text-slate-600 mb-2">Total Invoiced</p>
            <p className="text-3xl font-bold text-navy">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-slate-600 mb-2">Pending Payment</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(pendingAmount)}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="card p-6 mb-8">
          <label className="block text-sm font-semibold text-navy mb-2">
            Filter by Client
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoices Table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  ID
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Client
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Amount
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Due Date
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const client = clients.find((c) => c.id === invoice.clientId);
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        {invoice.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-navy font-semibold">
                        {client?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-navy">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusColor(invoice.status)}`}>
                          {capitalizeFirst(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4">
                        {invoice.status === 'pending' ? (
                          <button
                            onClick={() => handleApprove(invoice.id)}
                            className="text-green hover:text-green-dark font-semibold text-sm"
                          >
                            Approve
                          </button>
                        ) : (
                          <a
                            href={`/dashboard/invoices/${invoice.id}`}
                            className="text-navy hover:text-navy-dark font-semibold text-sm"
                          >
                            View
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
