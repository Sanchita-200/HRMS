'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockEmployees, MockEmployee } from '../../../lib/api';
import { Search, Filter, ArrowUpDown, X, User, Briefcase, Mail, Phone, Calendar, AlertTriangle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<MockEmployee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<MockEmployee | null>(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Filter employee database list
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_number.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
      
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-10rem)]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Workforce Directory</h1>
        <p className="text-xs text-slate-500">Search and audit employee metadata profiles</p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl border border-slate-900">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl w-full sm:max-w-xs">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:ring-0 focus:outline-none w-full"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/40 border border-slate-900 px-3 py-2 rounded-xl">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-transparent border-none text-white focus:ring-0 focus:outline-none pr-6 cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List of Employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => router.push(`/dashboard/employees/${emp.id}`)}
            className="glass p-6 rounded-2xl border border-slate-900 hover:border-slate-800 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                  {emp.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">{emp.full_name}</h3>
                  <span className="text-[10px] text-slate-500 font-semibold block">{emp.employee_number}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-900 pt-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  <span>{emp.designation} • <strong className="text-slate-300 font-semibold">{emp.department}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span>{emp.email}</span>
                </div>
              </div>
            </div>

            {/* Burnout Indicator bar */}
            <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Burnout risk</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 bg-slate-900 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className={`h-full rounded-full ${
                      emp.burnout_risk > 70 
                        ? 'bg-red-500' 
                        : emp.burnout_risk > 40 
                          ? 'bg-yellow-500' 
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${emp.burnout_risk}%` }}
                  />
                </div>
                <span className={`font-bold ${
                  emp.burnout_risk > 70 
                    ? 'text-red-400' 
                    : emp.burnout_risk > 40 
                      ? 'text-yellow-400' 
                      : 'text-emerald-400'
                }`}>{emp.burnout_risk}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sliding Drawer Side Profile panel */}
      <AnimatePresence>
        {selectedEmployee && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full sm:w-[450px] z-50 glass border-l border-slate-900 bg-slate-950/95 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                {/* Header Close button */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-6">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Employee Profile Details</span>
                  <button
                    onClick={() => setSelectedEmployee(null)}
                    className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Profile Meta Section */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-xl text-3xl mb-4">
                    {selectedEmployee.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedEmployee.full_name}</h2>
                  <p className="text-xs text-slate-400">{selectedEmployee.designation}</p>
                  <span className="mt-1 px-2.5 py-0.5 text-[9px] font-bold uppercase bg-slate-900 border border-slate-800 rounded-full text-slate-500">
                    {selectedEmployee.employee_number}
                  </span>
                </div>

                {/* Detailed Metadata fields */}
                <div className="space-y-4 border-t border-slate-900 pt-6 text-xs text-slate-400">
                  <div className="flex justify-between py-2 border-b border-slate-900/60">
                    <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-slate-500" /> Department</span>
                    <span className="font-semibold text-white">{selectedEmployee.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-900/60">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" /> Email</span>
                    <span className="font-semibold text-white">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-900/60">
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" /> Telephone</span>
                    <span className="font-semibold text-white">{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-900/60">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" /> Joined Date</span>
                    <span className="font-semibold text-white">{selectedEmployee.joining_date}</span>
                  </div>
                </div>

                {/* AI Performance Insight Panel */}
                <div className="mt-6 p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl text-xs">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-bold">AI Attrition & Burnout Analysis</span>
                  </div>
                  <p className="text-slate-400 leading-normal mb-3">
                    {selectedEmployee.burnout_risk > 70 
                      ? 'Overtime hours have exceeded standard safety thresholds for 3 consecutive weeks. Recommend scheduling a 1-on-1 check-in to mitigate burnout.'
                      : 'Working load metrics remain balanced within standard distributions. No immediate attrition indicators detected.'}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-slate-900 mt-6 grid grid-cols-2 gap-3">
                <button className="py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 transition-colors flex items-center justify-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-500" /> Documents
                </button>
                <button className="py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-[10px] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10">
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
