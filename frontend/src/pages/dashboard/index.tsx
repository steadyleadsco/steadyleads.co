import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface DashboardData {
  clientName: string;
  email: string;
  total_leads: number;
  total_invoices: number;
  total_revenue: number;
  landing_pages: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        
        if (!token) {
          router.push("/dashboard/login");
          return;
        }

        const [meRes, metricsRes] = await Promise.all([
          fetch("https://steadyleads.co/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://steadyleads.co/api/dashboard/metrics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!meRes.ok || !metricsRes.ok) {
          localStorage.removeItem("auth_token");
          router.push("/dashboard/login");
          return;
        }

        const meData = await meRes.json();
        const metricsData = await metricsRes.json();

        setData({
          clientName: meData.data.name,
          email: meData.data.email,
          ...metricsData.data,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy">Steady Leads</h1>
          <button
            onClick={() => {
              localStorage.removeItem("auth_token");
              router.push("/dashboard/login");
            }}
            className="text-slate-600 hover:text-navy"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-navy mb-2">{data.clientName}</h2>
          <p className="text-slate-600">{data.email}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-slate-600 mb-2">Total Leads</div>
            <div className="text-3xl font-bold text-navy">{data.total_leads}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-slate-600 mb-2">Landing Pages</div>
            <div className="text-3xl font-bold text-navy">{data.landing_pages}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-slate-600 mb-2">Invoices</div>
            <div className="text-3xl font-bold text-navy">{data.total_invoices}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-slate-600 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green">
              ${data.total_revenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-navy mb-4">Quick Stats</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-slate-600">Lead to Invoice Rate:</span>
              <span className="font-semibold text-navy">
                {data.total_leads > 0
                  ? ((data.total_invoices / data.total_leads) * 100).toFixed(1)
                  : 0}
              %
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Average Invoice Value:</span>
              <span className="font-semibold text-navy">
                ${
                  data.total_invoices > 0
                    ? (data.total_revenue / data.total_invoices).toFixed(0)
                    : 0
                }
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
