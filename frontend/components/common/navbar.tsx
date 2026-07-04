'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '../../lib/context';
import { Bell, Menu, User, Shield, Users, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { role, setRole, sidebarOpen, setSidebarOpen, setCopilotOpen, logout, user } = useUI();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const displayName = user?.name ?? 'Guest User';
  const displayEmail = user?.email ?? 'not signed in';
  const avatarText = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const notifications = [
    { id: '1', title: 'Leave Auto-Approved', text: 'Sarah Jenkins leave request auto-approved by AI.', time: '5m ago' },
    { id: '2', title: 'Burnout Warning', text: 'Marcus Vance burnout risk index is critical (88%).', time: '1h ago' },
    { id: '3', title: 'System Check Success', text: 'FastAPI backend connection ping returned 100% OK.', time: '2h ago' }
  ];

  return (
    <nav className="glass sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/60 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
      {/* Sidebar Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-medium text-slate-400">Enterprise HR Portal</h2>
          <p className="text-xs text-slate-500">Welcome back, {displayName}</p>
        </div>
      </div>

      {/* Actions and Controls */}
      <div className="flex items-center gap-4">
        {/* Hackathon Role Toggle */}
        <div className="flex items-center bg-slate-900/80 p-1.5 rounded-full border border-slate-800 shadow-inner">
          <button
            onClick={() => setRole('employee')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              role === 'employee'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-3 w-3" />
            Employee
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="h-3 w-3" />
            Admin
          </button>
        </div>

        {/* Notifications Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500" />
          </button>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-80 glass border border-slate-900 rounded-2xl p-4 shadow-xl z-50 bg-slate-950/95"
              >
                <h3 className="font-bold text-sm text-white mb-3">Recent Alerts</h3>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-900/80 text-xs">
                      <div className="flex justify-between font-bold text-slate-300 mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                      </div>
                      <p className="text-slate-400 font-medium">{n.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 bg-slate-900/40 hover:bg-slate-900/80 p-1.5 pr-3 rounded-xl border border-slate-900/80 transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
              {avatarText || 'GU'}
            </div>
            <span className="text-xs font-semibold text-slate-300 hidden md:block">{displayName}</span>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-48 glass border border-slate-900 rounded-2xl p-2 shadow-xl z-50 bg-slate-950/95 text-xs text-slate-400 space-y-1"
              >
                <div className="px-3 py-2 border-b border-slate-900 mb-1">
                  <p className="font-bold text-white">{displayName}</p>
                  <p className="text-[10px]">{displayEmail}</p>
                </div>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-900 hover:text-white rounded-lg transition-colors">
                  <User className="h-4 w-4" /> Profile Details
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-900 hover:text-white rounded-lg transition-colors">
                  <Settings className="h-4 w-4" /> Account Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowProfile(false);
                    router.push('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-950/30 hover:text-red-400 rounded-lg transition-colors text-red-500"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
