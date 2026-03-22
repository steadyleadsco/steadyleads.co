import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { useLeads, useClients, updateLead } from '@/lib/api';
import { formatDate, getStatusColor, capitalizeFirst } from '@/lib/utils';

export default function LeadsPage() {
  const [clientId, setClientId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { data: leadsData, isLoading: leadsLoading } = useLeads(clientId);
  const { data: clientsData, isLoading: clientsLoading } = useClients(1, 100);

  const leads = leadsData?.data || [];
  const clients = clientsData?.data || [];
  const filteredLeads = selectedStatus
    ? leads.filter((l) => l.status === selectedStatus)
    : leads;

  if (leadsLoading || clientsLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading leads...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">Leads</h1>

        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Filter by Client
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="input"
              >
                <option value="">All Clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="booked">Booked</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Email
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Treatment
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-navy">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{lead.email}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {capitalizeFirst(lead.treatment)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} leadId={lead.id} />
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status, leadId }: { status: string; leadId: string }) {
  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {capitalizeFirst(status)}
    </span>
  );
}
