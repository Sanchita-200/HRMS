'use client';

import React, { useState } from 'react';
import { Settings, Save, Bell, Lock, Palette, User } from 'lucide-react';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Alex Dev');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [themeMode, setThemeMode] = useState('dark');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully! (Simulation)');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500">Manage your account, notifications, and appearance preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preferences Form */}
        <div className="glass p-6 rounded-3xl border border-slate-900 lg:col-span-2">
          <h3 className="font-bold text-sm text-white mb-6 flex items-center gap-2">
            <Settings className="h-4 w-4 text-indigo-400" /> Personal Preferences
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Display Name</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <User className="h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-transparent border-none text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Theme</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <Palette className="h-4 w-4 text-slate-500" />
                  <select
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value)}
                    className="w-full bg-transparent border-none text-white focus:outline-none"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <span>
                  <span className="block font-bold text-white">Email notifications</span>
                  <span className="block text-[10px] text-slate-500">Receive updates and alerts by email</span>
                </span>
              </label>

              <label className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300">
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <span>
                  <span className="block font-bold text-white">Two-factor authentication</span>
                  <span className="block text-[10px] text-slate-500">Require a code during sign-in</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-indigo-600/10 transition-all mt-6"
            >
              <Save className="h-4 w-4" /> Save Settings
            </button>
          </form>
        </div>

        {/* Account summary */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-slate-900 text-xs">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-400" /> Account Security
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Signed-in user', status: displayName, icon: User, color: 'text-emerald-400' },
                { name: 'Theme mode', status: themeMode, icon: Palette, color: 'text-indigo-400' },
                { name: 'Email alerts', status: emailNotifications ? 'Enabled' : 'Disabled', icon: Bell, color: emailNotifications ? 'text-emerald-400' : 'text-slate-500' }
              ].map((service, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-slate-900/60">
                  <span className="flex items-center gap-2 text-slate-400">
                    <service.icon className="h-4 w-4 text-slate-500" />
                    {service.name}
                  </span>
                  <span className={`font-bold ${service.color}`}>{service.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
