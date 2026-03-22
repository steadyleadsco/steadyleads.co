import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { useDailyDigest } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function DigestPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { data: digestData, isLoading } = useDailyDigest(selectedDate);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading digest...</p>
        </div>
      </DashboardLayout>
    );
  }

  const digest = digestData?.data;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-navy">Daily Digest</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input max-w-xs"
          />
        </div>

        {!digest ? (
          <div className="card p-8 text-center">
            <p className="text-slate-600">No data available for this date.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Daily Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-green">{digest.newLeads}</p>
                <p className="text-sm text-slate-600 mt-2">New Leads</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{digest.contactedLeads}</p>
                <p className="text-sm text-slate-600 mt-2">Contacted</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-green-dark">{digest.bookedLeads}</p>
                <p className="text-sm text-slate-600 mt-2">Booked</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-slate-600">
                  {digest.newLeads + digest.contactedLeads + digest.bookedLeads}
                </p>
                <p className="text-sm text-slate-600 mt-2">Total Activity</p>
              </div>
            </div>

            {/* Top Clients */}
            {digest.topClients && digest.topClients.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-navy mb-4">Top Performing Clients</h2>
                <div className="space-y-3">
                  {digest.topClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-navy">{client.name}</p>
                        <p className="text-sm text-slate-600">
                          {client.leadsThisMonth} leads this month •{' '}
                          {(client.conversionRate * 100).toFixed(1)}% conversion
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {client.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Invoices */}
            {digest.pendingInvoices && digest.pendingInvoices.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-navy mb-4">Pending Invoices</h2>
                <div className="space-y-3">
                  {digest.pendingInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded"
                    >
                      <div>
                        <p className="font-semibold text-navy">
                          Invoice {invoice.id.slice(-8)}
                        </p>
                        <p className="text-sm text-slate-600">
                          Due: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-navy">
                          ${invoice.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes & Reminders */}
            <div className="card p-6 bg-blue-50 border-l-4 border-blue-500">
              <h2 className="text-lg font-semibold text-navy mb-3">Daily Highlights</h2>
              <ul className="space-y-2 text-slate-700">
                <li>• Check in on new leads from yesterday</li>
                <li>• Follow up with uncontacted prospects</li>
                <li>• Review invoice statuses</li>
                <li>• Celebrate wins with your team</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
