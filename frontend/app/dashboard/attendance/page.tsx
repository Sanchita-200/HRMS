'use client';

import React from 'react';
import { useUI } from '../../../lib/context';
import { mockAttendanceRecords } from '../../../lib/api';
import { Clock, CheckCircle2, AlertCircle, Sparkles, LogIn, LogOut, ShieldAlert } from 'lucide-react';

export default function AttendancePage() {
  const { isCheckedIn, setCheckedIn, checkInTime, setCheckInTime } = useUI();

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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Attendance Ledger</h1>
        <p className="text-xs text-slate-500">Track check-in timers, work hour stats, and AI logging reviews</p>
      </div>

      {/* Main Clock Card & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check In Panel */}
        <div className="glass p-6 rounded-3xl border border-slate-900 bg-gradient-to-tr from-slate-950 to-indigo-950/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Time Clock</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isCheckedIn 
                  ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                  : 'bg-red-950/20 text-red-400 border border-red-900/30'
              }`}>
                {isCheckedIn ? 'Clocked In' : 'Clocked Out'}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Log your shifts, check-in, and check-out to automatically update your monthly payroll allowances and attendance scoring models.
            </p>
          </div>

          <div className="space-y-3">
            {isCheckedIn && (
              <div className="text-center p-3 rounded-2xl bg-slate-900/60 border border-slate-900 text-xs mb-3">
                <span className="text-slate-500 block mb-0.5">Shift checked in at</span>
                <span className="text-sm font-bold text-white">{checkInTime}</span>
              </div>
            )}

            <button
              onClick={handleClockToggle}
              className={`w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isCheckedIn 
                  ? 'bg-red-950/20 border-red-900/50 text-red-400 hover:bg-red-950/40' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-lg shadow-indigo-600/10'
              }`}
            >
              {isCheckedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {isCheckedIn ? 'Clock Out Shift' : 'Clock In Shift'}
            </button>
          </div>
        </div>

        {/* Diagnostic Attendance Stats */}
        <div className="glass p-6 rounded-3xl border border-slate-900 lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { title: 'Working Days', value: '18 Days', subtitle: 'This Month', icon: CheckCircle2, color: 'text-emerald-400' },
            { title: 'Late Arrivals', value: '1 Day', subtitle: 'Late threshold > 9:05 AM', icon: AlertCircle, color: 'text-yellow-400' },
            { title: 'Avg Working Hours', value: '8.9 hrs', subtitle: 'Target: 8.0 hrs/day', icon: Clock, color: 'text-indigo-400' },
            { title: 'Work Efficiency', value: '98.2%', subtitle: 'Based on check-in stats', icon: Sparkles, color: 'text-purple-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/30 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.title}</span>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <span className="text-xl font-bold text-white block mb-0.5">{stat.value}</span>
                <span className="text-[9px] text-slate-500">{stat.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log History & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of logs */}
        <div className="glass p-6 rounded-3xl border border-slate-900 lg:col-span-2 overflow-x-auto">
          <h3 className="font-bold text-sm text-white mb-4">Clocking Log History</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider pb-3">
                <th className="py-2.5">Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAttendanceRecords.map((record, i) => (
                <tr key={i} className="border-b border-slate-900/60 text-slate-400">
                  <td className="py-3 font-semibold text-slate-300">{record.date}</td>
                  <td>{record.check_in}</td>
                  <td>{record.check_out}</td>
                  <td className="font-semibold text-slate-300">{record.hours} hrs</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      record.status === 'present' 
                        ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                        : 'bg-yellow-950/20 text-yellow-400 border border-yellow-900/30'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Insights Card */}
        <div className="glass p-6 rounded-3xl border border-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">AI Attendance Insights</h3>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl">
                <span className="font-bold text-indigo-400 block mb-1">Check-in Punctuality</span>
                <p className="text-slate-400 leading-normal">Your average arrival timing is 9:02 AM. Punctuality score stands in the 90th percentile of the Engineering division.</p>
              </div>

              <div className="p-3 bg-yellow-950/20 border border-yellow-900/30 rounded-2xl">
                <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="font-bold">Minor Latency Recorded</span>
                </div>
                <p className="text-slate-400 leading-normal">On Wednesday July 3rd, check-in was logged at 9:15 AM (15 minutes late). No payroll deductions were triggered.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
