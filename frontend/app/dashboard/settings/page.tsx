'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldAlert, Sparkles, Database, Mail } from 'lucide-react';

export default function SettingsPage() {
  const [appName, setAppName] = useState('AI-HRMS Engine');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [ollamaUrl, setOllamaUrl] = useState('http://ollama:11434');
  const [burnoutLimit, setBurnoutLimit] = useState('75');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings configurations saved successfully! (Simulation)');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500">Manage application settings, email configurations, and AI thresholds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Config Form */}
        <div className="glass p-6 rounded-3xl border border-slate-900 lg:col-span-2">
          <h3 className="font-bold text-sm text-white mb-6 flex items-center gap-2">
            <Settings className="h-4 w-4 text-indigo-400" /> Platform Configurations
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Application Brand Title</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Session Expiry Timeout (Minutes)</label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Ollama API Host Endpoint</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">AI Burnout Alert Trigger Threshold (%)</label>
                <input
                  type="number"
                  value={burnoutLimit}
                  onChange={(e) => setBurnoutLimit(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-indigo-600/10 transition-all mt-6"
            >
              <Save className="h-4 w-4" /> Save Configurations
            </button>
          </form>
        </div>

        {/* Configurations telemetry and pings */}
        <div className="space-y-6">
          {/* Services connectivity pings */}
          <div className="glass p-6 rounded-3xl border border-slate-900 text-xs">
            <h3 className="font-bold text-sm text-white mb-4">Core Systems Integration Telemetry</h3>
            <div className="space-y-4">
              {[
                { name: 'PostgreSQL Database Engine', status: 'Online', icon: Database, color: 'text-emerald-400' },
                { name: 'Ollama LLM Client (Model: llama3.1)', status: 'Connected', icon: Sparkles, color: 'text-emerald-400' },
                { name: 'SMTP Mail Server', status: 'Offline', icon: Mail, color: 'text-red-400' }
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
