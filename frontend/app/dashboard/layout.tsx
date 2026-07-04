'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UIProvider, useUI } from '../../lib/context';
import { Sidebar } from '../../components/common/sidebar';
import { Navbar } from '../../components/common/navbar';
import { Copilot } from '../../components/common/copilot';

// Inner wrapper that consumes the UIContext values
const DashboardLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { sidebarOpen, isAuthenticated, authReady } = useUI();

  useEffect(() => {
    if (authReady && !isAuthenticated) {
      router.replace('/');
    }
  }, [authReady, isAuthenticated, router]);

  if (!authReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Core View Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-[250px]' : 'lg:pl-[80px]'
        } pl-0`}
      >
        {/* Header Navigation */}
        <Navbar />

        {/* Dynamic page container */}
        <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>

        {/* Floating Copilot Widget */}
        <Copilot />
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  );
}
