import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { useClients, createClient, approveClient, updateClient } from '@/lib/api';
import { formatDate, getStatusColor, capitalizeFirst } from '@/lib/utils';
import type { Client } from '@/types';

export default function ClientsPage() {
  const { data: clientsData, isLoading, mutate } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    treatments: [],
    monthlyLeadTarget: 20,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monthlyLeadTarget' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createClient(formData);
      if (result.success) {
        setShowForm(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          treatments: [],
          monthlyLeadTarget: 20,
        });
        mutate();
      }
    } catch (err) {
      console.error('Error creating client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (clientId: string) => {
    try {
      await approveClient(clientId);
      mutate();
    } catch (err) {
      console.error('Error approving client:', err);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading clients...</p>
        </div>
      </DashboardLayout>
    );
  }

  const clients = clientsData?.data || [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-navy">Clients</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            + Add Client
          </button>
        </div>

        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-navy mb-4">New Client</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Clinic Name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="input"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city || ''}
                onChange={handleChange}
                className="input"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state || ''}
                onChange={handleChange}
                className="input"
              />
              <input
                type="number"
                name="monthlyLeadTarget"
                placeholder="Monthly Lead Target"
                value={formData.monthlyLeadTarget || ''}
                onChange={handleChange}
                className="input"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create Client'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
                  City
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Leads/Month
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No clients yet.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-navy">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{client.email}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {client.city}, {client.state}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusColor(client.status)}`}>
                        {capitalizeFirst(client.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{client.monthlyLeadTarget}</td>
                    <td className="px-6 py-4">
                      {client.status === 'pending-approval' ? (
                        <button
                          onClick={() => handleApprove(client.id)}
                          className="text-green hover:text-green-dark font-semibold text-sm"
                        >
                          Approve
                        </button>
                      ) : (
                        <a
                          href={`/dashboard/clients/${client.id}`}
                          className="text-navy hover:text-navy-dark font-semibold text-sm"
                        >
                          View
                        </a>
                      )}
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
