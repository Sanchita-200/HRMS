'use client';

import React from 'react';
import { BarChart2, Sparkles, AlertTriangle, TrendingUp, TrendingDown, Users, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Analytics & Insights</h1>
        <p className="text-xs text-slate-500">View predictive models, burnout indexes, and attrition forecasting</p>
      </div>

      {/* Analytics KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Burnout Risk Index', value: '38.4%', trend: 'Down 2.4%', up: false, icon: Zap, color: 'text-yellow-400 bg-yellow-950/20' },
          { title: 'Workforce Attrition Risk', value: '4.2%', trend: 'Down 0.8%', up: false, icon: Users, color: 'text-emerald-400 bg-emerald-950/20' },
          { title: 'Overtime Work Hours', value: '184 hrs', trend: 'Up 12.5%', up: true, icon: TrendingUp, color: 'text-indigo-400 bg-indigo-950/20' }
        ].map((card, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-slate-800 transition-colors">
            <div>
              <span className="text-xs text-slate-400 block mb-1 font-semibold">{card.title}</span>
              <span className="text-3xl font-extrabold text-white block mb-2">{card.value}</span>
              <div className="flex items-center gap-1">
                {card.up ? <TrendingUp className="h-3.5 w-3.5 text-indigo-400" /> : <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />}
                <span className={`text-[10px] font-bold ${card.up ? 'text-indigo-400' : 'text-emerald-400'}`}>{card.trend}</span>
              </div>
            </div>
            <div className={`p-3.5 rounded-xl border border-slate-800 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Burnout Risk and Custom Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom SVG Bar Chart showing Burnout Risk levels by Department */}
        <div className="glass p-6 rounded-3xl border border-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-white">Department Burnout Risk Indices</h3>
              <p className="text-[10px] text-slate-500">Model calculations based on overtime and check-ins</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { dept: 'Engineering', risk: 78, color: 'bg-indigo-600' },
              { dept: 'Finance', risk: 58, color: 'bg-purple-600' },
              { dept: 'Marketing', risk: 32, color: 'bg-blue-600' },
              { dept: 'Human Resources', risk: 14, color: 'bg-emerald-600' }
            ].map((bar, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">{bar.dept}</span>
                  <span className="text-slate-400 font-bold">{bar.risk}% risk</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-900 w-full">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${bar.color}`} 
                    style={{ width: `${bar.risk}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions for Burnout Prevention */}
        <div className="glass p-6 rounded-3xl border border-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">AI Prevention Recommendations</h3>
            </div>
            
            <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed">
              <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl">
                <span className="font-bold text-indigo-400 block mb-0.5">Engineering Division Check</span>
                <p>Engineering burnout index is high (78%). Suggest prompting developers to utilize accrued paid leaves.</p>
              </div>

              <div className="p-3 bg-yellow-950/10 border border-yellow-900/20 rounded-xl">
                <span className="font-bold text-yellow-400 block mb-0.5">Overtime Audit</span>
                <p>Excessive evening check-outs detected in Finance due to end-of-quarter audits. Suggest allocating temp staffing support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
