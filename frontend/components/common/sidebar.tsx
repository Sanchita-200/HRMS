'use client';

import React from 'react';
import { useUI } from '../../lib/context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  FileText, 
  CreditCard, 
  BarChart2, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const { role, sidebarOpen, setSidebarOpen } = useUI();
  const pathname = usePathname();

  // Navigation schema configured dynamically based on role type
  const employeeItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance Logs', path: '/dashboard/attendance', icon: Clock },
    { name: 'Leave Tracker', path: '/dashboard/leave', icon: FileText },
    { name: 'My Payroll', path: '/dashboard/payroll', icon: CreditCard },
    { name: 'System Settings', path: '/dashboard/settings', icon: Settings }
  ];

  const adminItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employee Directory', path: '/dashboard/employees', icon: Users },
    { name: 'Attendance Registry', path: '/dashboard/attendance', icon: Clock },
    { name: 'Leave Approvals', path: '/dashboard/leave', icon: FileText },
    { name: 'Company Payroll', path: '/dashboard/payroll', icon: CreditCard },
    { name: 'AI Analytics', path: '/dashboard/analytics', icon: BarChart2 },
    { name: 'System Settings', path: '/dashboard/settings', icon: Settings }
  ];

  const navItems = role === 'admin' ? adminItems : employeeItems;

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? '250px' : '80px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`glass fixed top-0 left-0 z-50 h-screen border-r border-slate-900 bg-slate-950/80 flex flex-col justify-between hidden lg:flex`}
    >
      <div>
        {/* Title Brand Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-500 p-2 rounded-lg shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-extrabold text-sm tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                AI-HRMS
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-4 px-3.5 py-3 rounded-xl transition-all duration-200 text-xs font-semibold ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-500/5'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account Settings shortcut */}
      <div className="p-4 border-t border-slate-900">
        <Link
          href="/"
          className="flex items-center gap-4 px-3.5 py-3 rounded-xl text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors text-xs font-semibold"
        >
          <LogOut className="h-5 w-5" />
          {sidebarOpen && <span>Logout</span>}
        </Link>
      </div>
    </motion.aside>
  );
};
