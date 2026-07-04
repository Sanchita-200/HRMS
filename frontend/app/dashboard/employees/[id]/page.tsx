'use client';

import React, { useState, useEffect } from 'react';
import { useUI } from '../../../../lib/context';
import { mockEmployees, mockAttendanceRecords } from '../../../../lib/api';
import { 
  User, Briefcase, Mail, Phone, MapPin, Calendar, 
  Clock, FileText, CreditCard, Sparkles, Plus, Trash2, 
  Download, Eye, Search, AlertTriangle, ShieldCheck, 
  Bot, Send, CheckCircle2, ChevronRight, BarChart2,
  Lock, BookOpen, Award, FileUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeeProfileHub({ params }: { params: { id: string } }) {
  const { role } = useUI();
  const employee = mockEmployees.find((e) => e.id === params.id) || mockEmployees[0];
  
  const [activeTab, setActiveTab] = useState('overview');

  // --- 1. RESUME PARSING SIMULATION ---
  const [isResumeParsed, setIsResumeParsed] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const handleResumeUpload = () => {
    setIsResumeParsed(false);
    setParsingProgress(10);
    const interval = setInterval(() => {
      setParsingProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsResumeParsed(true);
          return 100;
        }
        return p + 30;
      });
    }, 400);
  };

  // --- 2. DOCUMENTS VAULT STATE ---
  const [docsSearch, setDocsSearch] = useState('');
  const [documentsList, setDocumentsList] = useState([
    { id: '1', name: 'Offer_Letter.pdf', type: 'Offer Letter', size: '1.2 MB', date: '2022-04-12' },
    { id: '2', name: 'PAN_Card.pdf', type: 'PAN Card', size: '420 KB', date: '2022-04-13' },
    { id: '3', name: 'Aadhaar_Card.pdf', type: 'Aadhaar Card', size: '890 KB', date: '2022-04-13' },
    { id: '4', name: 'Payslip_June_2026.pdf', type: 'Payslips', size: '310 KB', date: '2026-06-30' }
  ]);
  const handleDeleteDoc = (id: string) => {
    setDocumentsList((prev) => prev.filter((d) => d.id !== id));
  };

  // --- 3. SALARY CONFIGURATION STATES (ADMIN/HR ACCESSIBLE) ---
  const [monthlyWage, setMonthlyWage] = useState(50000);
  const [workingDays, setWorkingDays] = useState(5);
  const [workingHours, setWorkingHours] = useState(8);
  const [basicPct, setBasicPct] = useState(50);
  const [hraPct, setHraPct] = useState(50);
  
  const [standardType, setStandardType] = useState<'pct' | 'fixed'>('fixed');
  const [standardVal, setStandardVal] = useState(5000);
  
  const [performanceType, setPerformanceType] = useState<'pct' | 'fixed'>('fixed');
  const [performanceVal, setPerformanceVal] = useState(3000);
  
  const [ltaType, setLtaType] = useState<'pct' | 'fixed'>('fixed');
  const [ltaVal, setLtaVal] = useState(2000);
  
  const [pfEmployeePct, setPfEmployeePct] = useState(12);
  const [pfEmployerPct, setPfEmployerPct] = useState(12);
  const [profTax, setProfTax] = useState(200);

  const [isLoadingSalary, setIsLoadingSalary] = useState(true);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salarySaveLoading, setSalarySaveLoading] = useState(false);
  const [salaryToast, setSalaryToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Load salary configuration from backend on mount/tab change
  useEffect(() => {
    if (activeTab === 'salary') {
      setIsLoadingSalary(true);
      fetch(`http://localhost:8000/api/payroll/salary/${params.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to load salary configuration");
          return res.json();
        })
        .then(data => {
          setMonthlyWage(data.monthly_wage);
          setWorkingDays(data.working_days_per_week);
          setWorkingHours(data.working_hours_per_day);
          setBasicPct(data.basic_pct);
          setHraPct(data.hra_pct);
          setStandardType(data.standard_allowance_type);
          setStandardVal(data.standard_allowance_val);
          setPerformanceType(data.performance_bonus_type);
          setPerformanceVal(data.performance_bonus_val);
          setLtaType(data.lta_type);
          setLtaVal(data.lta_val);
          setPfEmployeePct(data.pf_employee_pct);
          setPfEmployerPct(data.pf_employer_pct);
          setProfTax(data.professional_tax);
          setIsLoadingSalary(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoadingSalary(false);
        });
    }
  }, [activeTab, params.id]);

  // Live client-side calculations based on Indian Salary Math
  const calcBasic = (monthlyWage * basicPct) / 100;
  const calcHra = (calcBasic * hraPct) / 100;
  const calcStandard = standardType === 'pct' ? (monthlyWage * standardVal) / 100 : standardVal;
  const calcPerformance = performanceType === 'pct' ? (monthlyWage * performanceVal) / 100 : performanceVal;
  const calcLta = ltaType === 'pct' ? (monthlyWage * ltaVal) / 100 : ltaVal;
  
  const totalComponents = calcBasic + calcHra + calcStandard + calcPerformance + calcLta;
  const fixedAllowance = monthlyWage - totalComponents;
  
  const calcPF = (calcBasic * pfEmployeePct) / 100;
  const calcNet = monthlyWage - calcPF - profTax;
  
  const isSalaryValid = totalComponents <= monthlyWage;
  const salaryError = !isSalaryValid 
    ? `Validation Error: Sum of components (₹${totalComponents.toLocaleString()}) exceeds Monthly Wage (₹${monthlyWage.toLocaleString()}). Difference: +₹${(totalComponents - monthlyWage).toLocaleString()}` 
    : '';

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSalaryValid) return;
    setSalarySaveLoading(true);
    setSalaryToast(null);
    try {
      const res = await fetch(`http://localhost:8000/api/payroll/salary/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_wage: monthlyWage,
          working_days_per_week: workingDays,
          working_hours_per_day: workingHours,
          basic_pct: basicPct,
          hra_pct: hraPct,
          standard_allowance_type: standardType,
          standard_allowance_val: standardVal,
          performance_bonus_type: performanceType,
          performance_bonus_val: performanceVal,
          lta_type: ltaType,
          lta_val: ltaVal,
          pf_employee_pct: pfEmployeePct,
          pf_employer_pct: pfEmployerPct,
          professional_tax: profTax
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to save salary settings");
      }
      setSalaryToast({ type: 'success', message: 'Salary structure updated successfully in backend.' });
      setIsEditingSalary(false);
    } catch (err: any) {
      setSalaryToast({ type: 'error', message: err.message });
    } finally {
      setSalarySaveLoading(false);
      setTimeout(() => setSalaryToast(null), 5000);
    }
  };

  // --- 4. AI SALARY ASSISTANT CHAT ---
  const [salaryChatInput, setSalaryChatInput] = useState('');
  const [salaryChatLog, setSalaryChatLog] = useState([
    { id: '1', sender: 'assistant', text: 'Ask me to explain salary calculations, suggest optimizations, or model CTC revisions.' }
  ]);
  const handleSalaryChatSend = () => {
    if (!salaryChatInput.trim()) return;
    const userMsg = { id: Math.random().toString(), sender: 'user', text: salaryChatInput };
    setSalaryChatLog((prev) => [...prev, userMsg]);
    setSalaryChatInput('');

    setTimeout(() => {
      let reply = "Processing salary modeling... Let me analyze the current CTC splits.";
      const query = userMsg.text.toLowerCase();
      if (query.includes('explain') || query.includes('calculate')) {
        reply = `Basic Pay: ₹${calcBasic.toFixed(2)}/mo. HRA: ₹${calcHra.toFixed(2)}/mo. Allowances sum up to ₹${(calcStandard + calcPerformance + calcLta + fixedAllowance).toFixed(2)}/mo. Deductions include Professional Tax (₹${profTax.toFixed(2)}/mo) and PF (₹${calcPF.toFixed(2)}/mo), yielding a monthly Net Take-Home of ₹${calcNet.toFixed(2)}.`;
      } else if (query.includes('suggest') || query.includes('optimize') || query.includes('better')) {
        reply = "Optimization suggestion: To maximize employee tax exemption under Indian standard rules, set HRA to 50% of Basic Pay (currently set to HRA % basic). Consider reducing the Special/Fixed allowance component accordingly.";
      }
      const botMsg = { id: Math.random().toString(), sender: 'assistant', text: reply };
      setSalaryChatLog((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'private', name: 'Private Information' },
    { id: 'resume', name: 'Resume Parse' },
    { id: 'skills', name: 'Skills' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'documents', name: 'Documents' },
    { id: 'attendance', name: 'Attendance' },
    { id: 'leave', name: 'Leave' },
    { id: 'performance', name: 'Performance' },
    { id: 'salary', name: 'Salary Management' },
    { id: 'timeline', name: 'Activity Timeline' }
  ];

  return (
    <div className="space-y-6">
      {/* 360° Profile Hub Header card */}
      <div className="glass rounded-3xl border border-slate-900 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-950/40 relative" />
        
        {/* Profile Card Summary Details */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 border-4 border-slate-950 flex items-center justify-center font-extrabold text-white text-4xl shadow-xl">
              {employee.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1.5">
                <h1 className="text-2xl font-bold text-white leading-none">{employee.full_name}</h1>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-slate-900 border border-slate-800 rounded-full text-indigo-400">
                  {employee.employee_number}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">{employee.designation} • <strong className="text-slate-200 font-semibold">{employee.department}</strong></p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {employee.email}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Mumbai, India</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {employee.joining_date}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <span className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Present
            </span>
          </div>
        </div>
      </div>

      {/* Tab Selectors Scroll Bar */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-950 border border-slate-900 rounded-2xl max-w-full">
        {tabs.map((tab) => {
          if (tab.id === 'salary' && role !== 'admin') return null; // Admin/HR restriction
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all relative ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 rounded-xl"
                  style={{ zIndex: 0 }}
                />
              )}
              <span className="relative z-10">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels Contents */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* --- TAB PANEL: OVERVIEW --- */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-900 lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-white mb-3">About Employee</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      A results-driven Frontend Specialist with over 4 years of experience building responsive, accessibility-conformant, and premium React interfaces. Leads architectural refactorings of core component kits and layout frameworks.
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-900 pt-6">
                    <h3 className="font-bold text-sm text-white mb-4">Work Experience</h3>
                    <div className="space-y-4">
                      {[
                        { title: 'Staff Frontend Developer', company: 'AI-HRMS Solutions', date: '2022 - Present', desc: 'Leads engineering component setups, styling systems, and next-gen dashboard workflows.' },
                        { title: 'Frontend Developer', company: 'SaaS Builder Labs', date: '2020 - 2022', desc: 'Maintained and migrated React portals to Next.js. Developed micro-animations.' }
                      ].map((exp, i) => (
                        <div key={i} className="flex gap-4 items-start text-xs text-slate-400">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 shrink-0">
                            <Briefcase className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <span className="font-bold text-white block mb-0.5">{exp.title}</span>
                            <span className="text-[10px] text-slate-500 font-semibold block mb-2">{exp.company} • {exp.date}</span>
                            <p className="leading-relaxed">{exp.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Secondary side info card */}
                <div className="glass p-6 rounded-2xl border border-slate-900 space-y-4 text-xs text-slate-400">
                  <h3 className="font-bold text-sm text-white mb-2">Manager reporting line</h3>
                  <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-900 p-3 rounded-xl">
                    <div className="h-9 w-9 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                      MK
                    </div>
                    <div>
                      <span className="font-bold text-white block">David Kross</span>
                      <span className="text-[10px] text-slate-500">Senior Python Developer</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-900 space-y-3">
                    <div className="flex justify-between">
                      <span>Emergency contact</span>
                      <span className="font-semibold text-white">+91 98765 43210 (Spouse)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages spoken</span>
                      <span className="font-semibold text-white">English, Hindi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: PRIVATE INFORMATION --- */}
            {activeTab === 'private' && (
              <div className="glass p-6 rounded-2xl border border-slate-900 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-bold text-sm text-white">Private & Legal Identity Records</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-400">
                  {[
                    { label: 'Date of Birth', value: '1996-08-24' },
                    { label: 'Gender Identification', value: 'Male' },
                    { label: 'Marital Status', value: 'Single' },
                    { label: 'Aadhaar Card Key ID', value: 'XXXX-XXXX-8910' },
                    { label: 'PAN Card Key ID', value: 'ABCDE1234F' },
                    { label: 'Nationality', value: 'India' },
                    { label: 'Home Address', value: 'Flat 402, Sea Breeze Apts, Bandra West, Mumbai, Maharashtra' },
                    { label: 'Bank Name & Branch', value: 'HDFC Bank, Bandra West Branch' },
                    { label: 'Bank Account Number', value: 'XXXXXX9870' }
                  ].map((field, i) => (
                    <div key={i} className="bg-slate-900/20 border border-slate-900 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">{field.label}</span>
                      <span className="font-semibold text-white">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB PANEL: RESUME PARSE --- */}
            {activeTab === 'resume' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <div className="glass p-6 rounded-2xl border border-slate-900 lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-white mb-2">AI Resume Parser</h3>
                    <p className="text-xs text-slate-400">Upload PDF to simulate parsing and semantic skill mapping.</p>
                  </div>
                  
                  {/* File Upload Area */}
                  <div className="border border-dashed border-slate-800 p-12 rounded-3xl text-center bg-slate-950/40 relative">
                    <FileUp className="h-10 w-10 text-indigo-500 mx-auto mb-4" />
                    <span className="text-xs font-bold text-slate-300 block mb-1">Drag and drop your resume file</span>
                    <span className="text-[10px] text-slate-500 block mb-6">Supports PDF formats up to 4MB</span>
                    <button
                      onClick={handleResumeUpload}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition-colors"
                    >
                      Select File
                    </button>
                    
                    {parsingProgress > 0 && parsingProgress < 100 && (
                      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-3xl">
                        <span className="text-xs font-bold text-white mb-2">Analyzing Resume...</span>
                        <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-900">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${parsingProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Parsed Output */}
                  {isResumeParsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-slate-900 pt-6 space-y-6 text-xs text-slate-400"
                    >
                      <h4 className="font-bold text-white text-xs">AI Extraction Highlights</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900/60 border border-slate-900 rounded-2xl">
                          <span className="font-bold text-slate-300 block mb-2">Extracted Education</span>
                          <p>B.S. in Computer Science - University of California, Berkeley (2016-2020)</p>
                        </div>
                        <div className="p-4 bg-slate-900/60 border border-slate-900 rounded-2xl">
                          <span className="font-bold text-slate-300 block mb-2">Projects Parsed</span>
                          <p>Core developer on React Glass UI, lead migration architect for SVB dashboard widgets.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* AI Resume Analysis side Panel */}
                <div className="glass p-6 rounded-2xl border border-slate-900 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">AI Skill Gap Analysis</h3>
                  </div>

                  {isResumeParsed ? (
                    <div className="space-y-4 text-xs text-slate-400">
                      <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/30 rounded-xl">
                        <span className="font-bold text-indigo-400 block mb-1">AI Resume Summary</span>
                        <p>High-quality React profile showing deep Next.js App router expertise. High code quality alignment.</p>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-slate-900/60">
                        <span>Required Skill Match</span>
                        <span className="font-semibold text-emerald-400">92% Match</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-900/60">
                        <span>Missing Skill gaps</span>
                        <span className="font-semibold text-yellow-400">Docker, Python API</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Upload and parse a resume file to run AI gap matching.</p>
                  )}
                </div>
              </div>
            )}

            {/* --- TAB PANEL: SKILLS --- */}
            {activeTab === 'skills' && (
              <div className="glass p-6 rounded-2xl border border-slate-900 space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-white mb-2">Workforce Skills Inventory</h3>
                  <p className="text-xs text-slate-400">Categorized capabilities, verified certifications, and experience levels.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { category: 'Programming Frameworks', list: [{ name: 'React.js', lvl: 'Expert', yr: 5 }, { name: 'Next.js', lvl: 'Staff', yr: 4 }, { name: 'TypeScript', lvl: 'Expert', yr: 5 }, { name: 'Tailwind CSS', lvl: 'Staff', yr: 5 }] },
                    { category: 'Soft Skills & Management', list: [{ name: 'Pair Programming', lvl: 'Expert', yr: 4 }, { name: 'Agile Workflows', lvl: 'Intermediate', yr: 3 }] },
                    { category: 'Development Tools', list: [{ name: 'Git & Github Actions', lvl: 'Expert', yr: 5 }, { name: 'Webpack / Vite', lvl: 'Intermediate', yr: 4 }] }
                  ].map((cat, i) => (
                    <div key={i} className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cat.category}</h4>
                      <div className="flex flex-wrap gap-3">
                        {cat.list.map((skill, j) => (
                          <div key={j} className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                            <span className="font-bold text-slate-300">{skill.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-slate-950 rounded-full border border-slate-900">
                              {skill.lvl} ({skill.yr} yrs)
                            </span>
                            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB PANEL: CERTIFICATES --- */}
            {activeTab === 'certificates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
                {[
                  { name: 'Certified React Native Architect', org: 'Meta Blueprint', issue: '2023-04-12', exp: '2026-04-12', link: 'https://credentials.meta/react-native-123' },
                  { name: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', issue: '2024-01-15', exp: '2027-01-15', link: 'https://aws.amazon/credentials/123' }
                ].map((cert, i) => (
                  <div key={i} className="glass p-5 rounded-2xl border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <Award className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-900/30">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white mb-1">{cert.name}</h3>
                      <p className="text-[10px] text-slate-500 font-semibold block mb-4">{cert.org}</p>
                      
                      <div className="space-y-1.5 border-t border-slate-900 pt-3">
                        <div className="flex justify-between">
                          <span>Issue Date</span>
                          <span className="font-semibold text-white">{cert.issue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expiration Date</span>
                          <span className="font-semibold text-white">{cert.exp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-between text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>View Credential Certificate</span>
                      <Eye className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* --- TAB PANEL: DOCUMENTS --- */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* Search / Filter toolbar */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl max-w-xs">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={docsSearch}
                    onChange={(e) => setDocsSearch(e.target.value)}
                    className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:ring-0 focus:outline-none w-full"
                  />
                </div>

                {/* Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
                  {documentsList
                    .filter((d) => d.name.toLowerCase().includes(docsSearch.toLowerCase()))
                    .map((doc) => (
                      <div key={doc.id} className="glass p-5 rounded-2xl border border-slate-900 flex justify-between items-center hover:border-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <FileText className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div>
                            <span className="font-bold text-white block mb-0.5">{doc.name}</span>
                            <span className="text-[10px] text-slate-500">{doc.type} • {doc.size}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white border border-slate-800 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-2 bg-red-950/10 hover:bg-red-950/20 rounded-lg text-red-500 border border-red-900/30 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* --- TAB PANEL: ATTENDANCE --- */}
            {activeTab === 'attendance' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-900 lg:col-span-2 overflow-x-auto">
                  <h3 className="font-bold text-sm text-white mb-4">Clocking Log History</h3>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider pb-3">
                        <th className="py-2.5">Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Hours Logged</th>
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
                
                <div className="glass p-6 rounded-2xl border border-slate-900 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">AI Attendance Insights</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Check-in logs reflect a 94.2% presence coefficient for this employee. Punctuality is standard (average check-in logged at 9:02 AM).
                  </p>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: LEAVE --- */}
            {activeTab === 'leave' && (
              <div className="glass p-6 rounded-2xl border border-slate-900">
                <h3 className="font-bold text-sm text-white mb-4">Leave Log balances</h3>
                <div className="grid grid-cols-3 gap-4 mb-6 text-xs text-slate-400">
                  <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                    <span className="block mb-1 text-[10px] uppercase font-bold text-slate-500">Paid Leave</span>
                    <strong className="text-xl text-white">14 / 20</strong> Days Remaining
                  </div>
                  <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                    <span className="block mb-1 text-[10px] uppercase font-bold text-slate-500">Sick Leave</span>
                    <strong className="text-xl text-white">8 / 10</strong> Days Remaining
                  </div>
                  <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                    <span className="block mb-1 text-[10px] uppercase font-bold text-slate-500">Casual Leave</span>
                    <strong className="text-xl text-white">4 / 6</strong> Days Remaining
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: PERFORMANCE --- */}
            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-900 lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">Key Performance Indicators (KPIs)</h3>
                      <p className="text-[10px] text-slate-500">Goals and deliverables ratings</p>
                    </div>
                    <span className="text-xl font-black text-indigo-400">4.8 / 5.0 Rating</span>
                  </div>
                  
                  <div className="space-y-4 text-xs text-slate-400">
                    {[
                      { goal: 'Component UI Migration speed', prog: 90 },
                      { goal: 'Page bundle size optimizations', prog: 85 },
                      { goal: 'Accessibility (A11Y) testing targets', prog: 100 }
                    ].map((kpi, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>{kpi.goal}</span>
                          <span className="text-slate-300">{kpi.prog}% complete</span>
                        </div>
                        <div className="h-2 bg-slate-900 border border-slate-900 rounded-full overflow-hidden w-full">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${kpi.prog}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass p-6 rounded-2xl border border-slate-900 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">AI Promotion Recommendation</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Model Analysis: Excellent KPI completions and team peer review scores yield an **85% promotion probability** for the upcoming review cycle. Recommend upgrading candidate to Lead UI developer track.
                  </p>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: SALARY MANAGEMENT (ADMIN ONLY) --- */}
            {activeTab === 'salary' && role === 'admin' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-slate-900 lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-indigo-400" /> Salary Management
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingSalary((prev) => !prev)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
                    >
                      {isEditingSalary ? 'Cancel Edit' : 'Edit Salary'}
                    </button>
                  </div>

                  {salaryToast && (
                    <div
                      className={`p-3 rounded-xl border text-[10px] flex items-start gap-2 ${
                        salaryToast.type === 'success'
                          ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                          : 'bg-red-950/20 border-red-900/30 text-red-400'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{salaryToast.message}</span>
                    </div>
                  )}

                  {isLoadingSalary ? (
                    <div className="rounded-2xl border border-slate-900 bg-slate-950/50 p-6 text-xs text-slate-500">
                      Loading salary configuration...
                    </div>
                  ) : (
                    <form onSubmit={handleSaveSalary} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Monthly Wage (₹)</label>
                          <input
                            type="number"
                            value={monthlyWage}
                            onChange={(e) => setMonthlyWage(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Working Days / Week</label>
                          <input
                            type="number"
                            value={workingDays}
                            onChange={(e) => setWorkingDays(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Working Hours / Day</label>
                          <input
                            type="number"
                            value={workingHours}
                            onChange={(e) => setWorkingHours(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Professional Tax (₹)</label>
                          <input
                            type="number"
                            value={profTax}
                            onChange={(e) => setProfTax(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Basic Pay (%)</label>
                          <input
                            type="number"
                            value={basicPct}
                            onChange={(e) => setBasicPct(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">HRA (%)</label>
                          <input
                            type="number"
                            value={hraPct}
                            onChange={(e) => setHraPct(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Standard Allowance</label>
                          <input
                            type="number"
                            value={standardVal}
                            onChange={(e) => setStandardVal(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Performance Bonus</label>
                          <input
                            type="number"
                            value={performanceVal}
                            onChange={(e) => setPerformanceVal(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">LTA</label>
                          <input
                            type="number"
                            value={ltaVal}
                            onChange={(e) => setLtaVal(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Employee PF (%)</label>
                          <input
                            type="number"
                            value={pfEmployeePct}
                            onChange={(e) => setPfEmployeePct(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Employer PF (%)</label>
                          <input
                            type="number"
                            value={pfEmployerPct}
                            onChange={(e) => setPfEmployerPct(Number(e.target.value))}
                            disabled={!isEditingSalary}
                            className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>

                      {!isSalaryValid && (
                        <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-[10px] text-red-400 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{salaryError}</span>
                        </div>
                      )}

                      <div className="border-t border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
                        <div className="space-y-2">
                          <div className="flex justify-between py-1.5 border-b border-slate-900/60">
                            <span>Basic Pay</span>
                            <span className="font-bold text-white">₹{calcBasic.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-900/60">
                            <span>HRA</span>
                            <span className="font-bold text-white">₹{calcHra.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-900/60">
                            <span>PF Deduction</span>
                            <span className="font-bold text-red-400">-₹{calcPF.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between py-1.5 border-b border-slate-900/60">
                            <span>Total Components</span>
                            <span className="font-bold text-white">₹{totalComponents.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-900/60">
                            <span>Fixed Allowance</span>
                            <span className="font-bold text-white">₹{fixedAllowance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-900/60">
                            <span>Net Salary</span>
                            <span className="font-bold text-emerald-400">₹{calcNet.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!isEditingSalary || salarySaveLoading || !isSalaryValid}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:brightness-110 shadow-lg shadow-indigo-600/10 transition-all disabled:opacity-60"
                      >
                        {salarySaveLoading ? 'Saving...' : 'Save Salary Configuration'}
                      </button>
                    </form>
                  )}
                </div>

                <div className="glass p-6 rounded-2xl border border-slate-900 flex flex-col justify-between h-[450px]">
                  <div className="flex flex-col h-[calc(100%-60px)]">
                    <div className="flex items-center gap-2 mb-4">
                      <Bot className="h-5 w-5 text-indigo-400" />
                      <h3 className="font-bold text-sm text-white">AI Salary Assistant</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3.5 p-1 mb-4 text-[10px] text-slate-400 leading-normal">
                      {salaryChatLog.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-2.5 rounded-xl border max-w-[85%] ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-300'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                    <input
                      type="text"
                      placeholder="Ask salary calculations..."
                      value={salaryChatInput}
                      onChange={(e) => setSalaryChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSalaryChatSend()}
                      className="flex-1 bg-transparent border-none text-[10px] text-white placeholder-slate-500 focus:ring-0 focus:outline-none px-2"
                    />
                    <button
                      type="button"
                      onClick={handleSalaryChatSend}
                      className="bg-indigo-600 text-white p-2 rounded-lg"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: TIMELINE --- */}
            {activeTab === 'timeline' && (
              <div className="glass p-6 rounded-2xl border border-slate-900">
                <h3 className="font-bold text-sm text-white mb-6">Activity Timeline</h3>
                
                <div className="relative pl-6 border-l border-slate-900 space-y-6 text-xs text-slate-400">
                  {[
                    { date: '2026-07-04', title: 'Daily check-in logged', desc: 'Checked in at 9:02 AM using remote office connection.' },
                    { date: '2026-07-02', title: 'AWS Cloud Certification added', desc: 'Added new AWS CCP credentials. Verified successfully.' },
                    { date: '2026-06-30', title: 'June Payslip generated', desc: 'Salary ledger compiled. Net compensation deposited.' },
                    { date: '2022-04-12', title: 'Joined the Company', desc: 'Employee profile activated. User setup completed.' }
                  ].map((event, i) => (
                    <div key={i} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full bg-slate-950 border-2 border-indigo-500" />
                      
                      <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">{event.date}</span>
                      <h4 className="font-bold text-white text-xs mb-1">{event.title}</h4>
                      <p>{event.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
