'use client';

import React from 'react';
import { CreditCard, Download, Sparkles, TrendingUp, DollarSign, Wallet, ArrowDownRight } from 'lucide-react';

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payroll Ledger</h1>
          <p className="text-xs text-slate-500">View salary allocations, payslips, and compensation analysis</p>
        </div>
        <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 transition-colors">
          <Download className="h-4 w-4" /> Download Payslip (PDF)
        </button>
      </div>

      {/* Overview Statement Card & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <div className="glass p-6 rounded-3xl border border-indigo-950 bg-gradient-to-tr from-slate-950 to-indigo-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Net Compensation</span>
              <span className="text-indigo-400 font-extrabold text-sm">₹</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-white block mb-1">₹84,200</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Salary Month: June 2026</span>
            </div>
          </div>

          <div className="space-y-3 pt-6 mt-6 border-t border-slate-900 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Basic Salary</span>
              <span className="font-semibold text-white">₹65,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Allowances & Bonuses</span>
              <span className="font-semibold text-emerald-400">+₹23,700</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Taxes & Deductions</span>
              <span className="font-semibold text-red-400">-₹4,500</span>
            </div>
          </div>
        </div>

        {/* AI Compensation breakdown analysis */}
        <div className="glass p-6 rounded-3xl border border-slate-900 lg:col-span-2 flex flex-col justify-between bg-gradient-to-r from-slate-950 via-slate-950 to-purple-950/10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">AI Salary Statement Analysis</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your compensation index has seen a **12% increase** compared to May. This difference is driven by a Project Completion Bonus (₹15,000) and minor updates in transport allowance mappings.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard deductions remained unchanged, comprising health insurance (₹1,500) and tax withholdings (₹3,000). Net tax burden stands within optimal ranges (4.2% effective).
            </p>
          </div>

          <div className="pt-4 border-t border-slate-900 mt-4 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-bold uppercase">Estimated next cycle run</span>
            <span className="font-bold text-slate-300">July 28th, 2026</span>
          </div>
        </div>
      </div>

      {/* Salary Breakdown lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings */}
        <div className="glass p-6 rounded-2xl border border-slate-900">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-400" /> Earnings Component Breakdown
          </h3>
          <div className="space-y-3.5 text-xs text-slate-400">
            {[
              { name: 'Base Grade Compensation', amount: '₹65,000' },
              { name: 'House Rent Allowance (HRA)', amount: '₹5,000' },
              { name: 'Project Milestone Performance Bonus', amount: '₹15,000' },
              { name: 'Conveyance & Travel Reimbursement', amount: '₹3,700' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-900/60">
                <span>{item.name}</span>
                <span className="font-semibold text-slate-200">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions */}
        <div className="glass p-6 rounded-2xl border border-slate-900">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-red-400" /> Deductions Component Breakdown
          </h3>
          <div className="space-y-3.5 text-xs text-slate-400">
            {[
              { name: 'Federal Income Tax Withholding', amount: '₹3,000' },
              { name: 'Medical & Dental Insurance Premium', amount: '₹1,500' },
              { name: 'Professional Tax deduction', amount: '₹200' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-900/60">
                <span>{item.name}</span>
                <span className="font-semibold text-slate-200">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
