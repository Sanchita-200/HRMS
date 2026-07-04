'use client';

import React from 'react';
import { useUI } from '../../lib/context';
import { 
  Clock, 
  Calendar, 
  FileText, 
  CreditCard, 
  ArrowUpRight, 
  UserCheck, 
  Users, 
  UserMinus, 
  Flame, 
  AlertTriangle,
  Bot,
  ArrowRight,
  TrendingUp,
  FileUp,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OverviewDashboard() {
  const { role, isCheckedIn, setCheckedIn, checkInTime, setCheckInTime, setCopilotOpen } = useUI();

  const handleClockToggle = () => {
    if (!isCheckedIn) {
      setCheckedIn(true);
      const now = new Date();
      setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setCheckedIn(false);
      setCheckInTime(null);
    }
  };

  // --- RENDERING EMPLOYEE DASHBOARD ---
  if (role === 'employee') {
    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Good Morning / Hero Welcome banner */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-slate-900 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-950 to-indigo-950/20">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Bot className="h-48 w-48 text-indigo-500" />
          </div>
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">My Portal Overview</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Good morning, Alex</h1>
            <p className="text-xs text-slate-400 mb-6">Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            {/* AI Summary Notification */}
            <div className="flex items-start gap-3 bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-2xl text-xs text-indigo-300">
              <Bot className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">AI Copilot Daily Briefing</span>
                <p className="leading-relaxed">Your casual leave request for July 15th has been auto-approved based on standard staff coverage thresholds. You are on track for 36 working hours this week with 2.5 overtime hours logged.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Attendance Rate', value: '94.2%', subtitle: 'This Month', icon: CalendarCheck, color: 'text-indigo-400' },
            { title: 'Remaining Leaves', value: '14 Days', subtitle: 'Paid / Casual', icon: FileText, color: 'text-emerald-400' },
            { title: 'Overtime Hours', value: '2.5 hrs', subtitle: 'This Week', icon: Clock, color: 'text-purple-400' },
            { title: 'Monthly Salary', value: '₹84,200', subtitle: 'Net Pay', icon: CreditCard, color: 'text-blue-400' }
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-slate-800 transition-colors">
              <div>
                <span className="text-xs text-slate-400 block mb-1 font-semibold">{stat.title}</span>
                <span className="text-2xl font-bold text-white block mb-1">{stat.value}</span>
                <span className="text-[10px] text-slate-500">{stat.subtitle}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Actions & Attendance Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions (Check-In) */}
          <div className="glass p-6 rounded-2xl border border-slate-900 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-white mb-4">Quick Workflows</h3>
              <div className="space-y-3">
                {/* Check In Button */}
                <button
                  onClick={handleClockToggle}
                  className={`w-full py-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isCheckedIn 
                      ? 'bg-red-950/20 border-red-900/50 text-red-400 hover:bg-red-950/40' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent hover:brightness-110 shadow-lg shadow-indigo-600/10'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {isCheckedIn ? `Check Out (Clocked in ${checkInTime})` : 'Check In Now'}
                </button>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <button className="bg-slate-900 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 transition-colors flex flex-col items-center gap-1.5">
                    <FileText className="h-4 w-4 text-emerald-400" /> Apply Leave
                  </button>
                  <button className="bg-slate-900 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 transition-colors flex flex-col items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-blue-400" /> View Payslips
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-900 mt-4">
              <button 
                onClick={() => setCopilotOpen(true)}
                className="w-full flex items-center justify-between text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Ask HR Copilot a question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Core Personal Calendar / Attendance Logs Overview */}
          <div className="glass p-6 rounded-2xl border border-slate-900 lg:col-span-2">
            <h3 className="font-bold text-sm text-white mb-4">Calendar Attendance logs</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500 font-semibold mb-3">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                // mock attendance status
                let bg = 'bg-slate-900 text-slate-500 border border-slate-900';
                if (day < 5) bg = 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30';
                if (day === 3) bg = 'bg-yellow-950/20 text-yellow-400 border border-yellow-900/30';
                if (day === 5) bg = 'bg-indigo-950/20 text-indigo-400 border border-indigo-900/40 font-bold';
                return (
                  <div key={i} className={`p-2.5 rounded-lg text-center ${bg}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING ADMIN DASHBOARD ---
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Executive Overview Section Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-500">Corporate stats briefing and AI intelligence forecasts</p>
      </div>

      {/* Admin Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Workforce', value: '124 Active', subtitle: '+4 Joined this month', icon: Users, color: 'text-indigo-400' },
          { title: 'Presence Rate', value: '95.1%', subtitle: '118 Checked in today', icon: UserCheck, color: 'text-emerald-400' },
          { title: 'Absent Rate', value: '4.9%', subtitle: '6 Employees off today', icon: UserMinus, color: 'text-red-400' },
          { title: 'Pending Approvals', value: '3 Requests', subtitle: 'Needs review', icon: FileText, color: 'text-yellow-400' }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-slate-800 transition-colors">
            <div>
              <span className="text-xs text-slate-400 block mb-1 font-semibold">{stat.title}</span>
              <span className="text-2xl font-bold text-white block mb-1">{stat.value}</span>
              <span className="text-[10px] text-slate-500">{stat.subtitle}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Analytics & Copilot Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Area Chart showing Attendance Trends */}
        <div className="glass p-6 rounded-2xl border border-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-white">Daily Attendance Trend</h3>
              <p className="text-[10px] text-slate-500">Weekly check-in volume parameters</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-900/30">
              <TrendingUp className="h-3.5 w-3.5" /> +2.4% avg
            </div>
          </div>

          {/* Premium Custom SVG Line Chart */}
          <div className="h-56 w-full relative">
            <svg viewBox="0 0 500 200" className="w-full h-full text-indigo-500/10 fill-current">
              {/* Grids */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#0f172a" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#0f172a" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#0f172a" strokeWidth="1" />
              
              {/* Area Gradient */}
              <path d="M 0 160 Q 100 80, 200 120 T 400 40 L 500 80 L 500 200 L 0 200 Z" />
              
              {/* Lines */}
              <path 
                d="M 0 160 Q 100 80, 200 120 T 400 40 L 500 80" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3.5" 
                className="drop-shadow-[0_4px_10px_rgba(99,102,241,0.4)]"
              />

              {/* Data points */}
              <circle cx="200" cy="120" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
              <circle cx="400" cy="40" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-[10px] text-slate-500 font-semibold">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            </div>
          </div>
        </div>

        {/* AI Insight Alerts Side Panel */}
        <div className="glass p-6 rounded-2xl border border-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">AI Insights Panel</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Workplace Burnout Alert', text: 'Sarah Jenkins is at high risk (78%) due to excess overtime.', icon: Flame, color: 'text-red-400 bg-red-950/20 border-red-900/30' },
                { title: 'Irregular Check-In Timing', text: 'Marcus Vance logged 3 late arrivals this week.', icon: AlertTriangle, color: 'text-yellow-400 bg-yellow-950/20 border-yellow-900/30' },
                { title: 'Leave Auto-Recommendation', text: '2 requests match automatic approval conditions.', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30' }
              ].map((alert, i) => (
                <div key={i} className={`p-3.5 rounded-xl border flex items-start gap-3 ${alert.color}`}>
                  <alert.icon className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[10px] text-white block mb-0.5">{alert.title}</span>
                    <p className="text-[10px] text-slate-400 leading-normal">{alert.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 mt-4">
            <button 
              onClick={() => setCopilotOpen(true)}
              className="w-full flex items-center justify-between text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Launch AI Audit Companion</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
