'use client';

import React, { useState } from 'react';
import { useUI } from '../../../lib/context';
import { mockLeaveRequests, MockLeave } from '../../../lib/api';
import { FileText, CheckCircle2, XCircle, Clock, Sparkles, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeavePage() {
  const { role } = useUI();
  const [requests, setRequests] = useState<MockLeave[]>(mockLeaveRequests);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Apply Leave Form States
  const [leaveType, setLeaveType] = useState('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;
    
    const newRequest: MockLeave = {
      id: Math.random().toString(36).substr(2, 9),
      employee_name: 'Alex Dev',
      leave_type: leaveType,
      reason,
      start_date: startDate,
      end_date: endDate,
      status: 'pending',
      ai_recommendation: 'Auto-Approval: Matches standard requirements. Total staff availability in Engineering remains above safety thresholds.'
    };

    setRequests([newRequest, ...requests]);
    setShowApplyModal(false);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleApprove = (id: string) => {
    setRequests((prev) => 
      prev.map((req) => req.id === id ? { ...req, status: 'approved' } : req)
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) => 
      prev.map((req) => req.id === id ? { ...req, status: 'rejected' } : req)
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leaves Registry</h1>
          <p className="text-xs text-slate-500">Submit requests, review balances, and manage team absence cycles</p>
        </div>
        
        {role === 'employee' && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 shadow-lg shadow-indigo-600/10 transition-all"
          >
            <Plus className="h-4 w-4" /> Apply Leave
          </button>
        )}
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { name: 'Paid Leaves', count: '14 / 20', color: 'text-indigo-400 border-indigo-950 bg-indigo-950/10' },
          { name: 'Sick Leaves', count: '8 / 10', color: 'text-emerald-400 border-emerald-950 bg-emerald-950/10' },
          { name: 'Casual Leaves', count: '4 / 6', color: 'text-purple-400 border-purple-950 bg-purple-950/10' }
        ].map((card, i) => (
          <div key={i} className={`glass p-6 rounded-2xl border ${card.color} flex flex-col justify-between`}>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block mb-2">{card.name}</span>
            <span className="text-3xl font-extrabold text-white">{card.count}</span>
            <span className="text-[9px] opacity-60 mt-1 block">Remaining days</span>
          </div>
        ))}
      </div>

      {/* Leave Requests queues */}
      <div className="glass p-6 rounded-3xl border border-slate-900 overflow-x-auto">
        <h3 className="font-bold text-sm text-white mb-4">
          {role === 'admin' ? 'Workforce Leave Requests' : 'My Leave Requests'}
        </h3>
        
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider pb-3">
              <th className="py-2.5">Employee</th>
              <th>Leave Type</th>
              <th>Reason</th>
              <th>Dates</th>
              <th>AI recommendation</th>
              <th>Status</th>
              {role === 'admin' && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-slate-900/60 text-slate-400">
                <td className="py-3 font-semibold text-slate-300">{req.employee_name}</td>
                <td>{req.leave_type}</td>
                <td className="max-w-xs truncate">{req.reason}</td>
                <td className="whitespace-nowrap font-medium text-slate-300">{req.start_date} to {req.end_date}</td>
                <td className="max-w-sm text-[10px] text-indigo-400">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>{req.ai_recommendation}</span>
                  </div>
                </td>
                <td>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    req.status === 'approved' 
                      ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                      : req.status === 'rejected'
                        ? 'bg-red-950/20 text-red-400 border border-red-900/30'
                        : 'bg-yellow-950/20 text-yellow-400 border border-yellow-900/30'
                  }`}>
                    {req.status}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="text-right whitespace-nowrap">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleReject(req.id)}
                          className="p-1 text-red-500 hover:bg-red-950/20 rounded border border-red-900/40"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="p-1 text-emerald-500 hover:bg-emerald-950/20 rounded border border-emerald-900/40"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600">Processed</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Leave Modal Drawer overlay */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass border border-slate-900 rounded-3xl p-6 shadow-2xl bg-slate-950/95"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-4">
                <h3 className="font-bold text-sm text-white">Apply for Leave</h3>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Paid Leave">Paid Leave (Annual)</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Reason for Request</label>
                  <textarea
                    placeholder="Provide details about your absence..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white focus:outline-none placeholder-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-indigo-600/10 transition-all mt-4"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
