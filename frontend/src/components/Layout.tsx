import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth, logout } from '@/lib/api';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-navy">
            Steady Leads
          </Link>
          <div className="space-x-6">
            <Link href="/" className="text-slate-600 hover:text-navy">
              Home
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-navy">
              Pricing
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-navy">
              About
            </Link>
            <Link href="/dashboard/login" className="btn-primary">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="bg-navy text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p>&copy; 2024 Steady Leads. All rights reserved.</p>
          <p className="text-slate-400 mt-2">abel@steadyleads.co</p>
        </div>
      </footer>
    </>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/dashboard/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold text-navy">
            Steady Leads
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          <NavLink href="/dashboard" label="Dashboard" />
          {user.role === 'admin' && (
            <>
              <NavLink href="/dashboard/clients" label="Clients" />
              <NavLink href="/dashboard/leads" label="Leads" />
              <NavLink href="/dashboard/invoices" label="Invoices" />
              <NavLink href="/dashboard/digest" label="Daily Digest" />
            </>
          )}
          {user.role === 'client' && (
            <>
              <NavLink href="/dashboard/leads" label="My Leads" />
              <NavLink href="/dashboard/invoices" label="Invoices" />
            </>
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 w-64">
          <div className="text-sm text-slate-600 mb-4">{user.email}</div>
          <button
            onClick={() => {
              logout();
              router.push('/dashboard/login');
            }}
            className="btn-secondary w-full"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-green text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </Link>
  );
}
