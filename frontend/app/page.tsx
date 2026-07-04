'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Clock, FileText, CreditCard, 
  Bot, BarChart3, Layers, Terminal, Sparkles, 
  Mail, Lock, Eye, EyeOff, Building, User, Phone, CheckSquare, 
  ArrowRight, Chrome, Github, AlertTriangle
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [formMode, setFormMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // --- MOUSE PARALLAX HOOKS ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- SIGN IN STATE ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- SIGN UP STATE ---
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // --- PASSWORD STRENGTH METER ---
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('Weak');
  const [strengthColor, setStrengthColor] = useState('bg-red-500');

  useEffect(() => {
    const pwd = formMode === 'signup' ? signupPassword : loginPassword;
    if (!pwd) {
      setPasswordStrength(0);
      setStrengthLabel('Weak');
      setStrengthColor('bg-red-500');
      return;
    }

    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

    setPasswordStrength(score);
    if (score <= 25) {
      setStrengthLabel('Weak');
      setStrengthColor('bg-red-500');
    } else if (score <= 75) {
      setStrengthLabel('Medium');
      setStrengthColor('bg-yellow-500');
    } else {
      setStrengthLabel('Strong');
      setStrengthColor('bg-emerald-500');
    }
  }, [signupPassword, loginPassword, formMode]);

  // --- FORM SUBMIT HANDLING ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (formMode === 'signin') {
      // Validate inputs
      if (!loginEmail.trim() || !loginPassword.trim()) {
        setFormError('Please enter both email and password.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(loginEmail)) {
        setFormError('Please enter a valid email address.');
        return;
      }

      setIsLoading(true);

      // Simulate Authentication API Call (Connecting to database layer V1)
      setTimeout(() => {
        setIsLoading(false);
        setFormSuccess('Access Granted. Redirecting to your workspace...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }, 1500);

    } else {
      // Sign Up validation
      if (!companyName.trim() || !fullName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
        setFormError('All fields are required.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(signupEmail)) {
        setFormError('Please enter a valid email address.');
        return;
      }
      if (signupPassword.length < 8) {
        setFormError('Password must be at least 8 characters long.');
        return;
      }
      if (signupPassword !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      if (!termsAccepted) {
        setFormError('You must accept the terms and conditions.');
        return;
      }

      setIsLoading(true);

      // Simulate Sign Up API Call
      setTimeout(() => {
        setIsLoading(false);
        setFormSuccess('Account initialized! Swapping to Sign In...');
        setTimeout(() => {
          setFormMode('signin');
          setFormSuccess('');
          setLoginEmail(signupEmail);
          setLoginPassword(signupPassword);
        }, 1500);
      }, 1800);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B1020] overflow-hidden text-slate-100 flex font-sans">
      {/* Aurora moving gradient mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B1020] to-[#0B1020] z-0 pointer-events-none" />
      <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Split Layout Container */}
      <div className="flex-1 flex w-full relative z-10">
        
        {/* --- LEFT PANEL: Futurist AI Core Centerpiece --- */}
        <div className="hidden lg:flex lg:w-3/5 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-900 bg-slate-950/20">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AI-HRMS</span>
            </div>
          </div>

          {/* Glowing AI Core with orbit widgets */}
          <div className="relative flex-1 flex items-center justify-center">
            {/* Concentric rotating glowing SVG rings */}
            <motion.div 
              style={{ x: mousePos.x * 20, y: mousePos.y * 20 }}
              className="absolute h-96 w-96 rounded-full border border-indigo-500/10 flex items-center justify-center"
            >
              <div className="h-80 w-80 rounded-full border border-purple-500/15 flex items-center justify-center animate-spin" style={{ animationDuration: '40s' }}>
                <div className="h-6 w-6 bg-purple-500/30 rounded-full blur-sm" />
              </div>
            </motion.div>

            <motion.div 
              style={{ x: mousePos.x * -15, y: mousePos.y * -15, animationDuration: '25s', animationDirection: 'reverse' } as any}
              className="absolute h-72 w-72 rounded-full border border-blue-500/10 flex items-center justify-center animate-spin"
            >
              <div className="h-4 w-4 bg-blue-400/40 rounded-full blur-sm" />
            </motion.div>

            {/* Glowing AI Core centerpiece */}
            <motion.div 
              style={{ x: mousePos.x * 10, y: mousePos.y * 10 }}
              className="absolute h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 p-[1px] shadow-[0_0_50px_rgba(99,102,241,0.25)] flex items-center justify-center"
            >
              <div className="h-full w-full bg-[#0B1020] rounded-full flex flex-col items-center justify-center relative overflow-hidden">
                <Bot className="h-12 w-12 text-indigo-400 animate-pulse" />
                <span className="text-[9px] font-black text-indigo-300 tracking-widest mt-2 uppercase">Core AI V1.0</span>
              </div>
            </motion.div>

            {/* Orbiting Glass Cards Parallax widgets */}
            {/* Widget 1: Attendance rate */}
            <motion.div
              style={{ x: mousePos.x * 30 - 150, y: mousePos.y * 30 - 120 }}
              className="absolute glass p-4 rounded-2xl border border-slate-900 bg-slate-950/60 shadow-lg text-xs"
            >
              <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold">
                <Clock className="h-4 w-4" /> <span>94.2% Presence</span>
              </div>
              <p className="text-[10px] text-slate-500">Workforce daily average clocking score</p>
            </motion.div>

            {/* Widget 2: Leaves balance */}
            <motion.div
              style={{ x: mousePos.x * -25 + 140, y: mousePos.y * -25 - 110 }}
              className="absolute glass p-4 rounded-2xl border border-slate-900 bg-slate-950/60 shadow-lg text-xs"
            >
              <div className="flex items-center gap-2 mb-1.5 text-indigo-400 font-bold">
                <FileText className="h-4 w-4" /> <span>14 Leaves Remaining</span>
              </div>
              <p className="text-[10px] text-slate-500">Average accrued paid leaves logs</p>
            </motion.div>

            {/* Widget 3: Compensation */}
            <motion.div
              style={{ x: mousePos.x * 25 + 150, y: mousePos.y * 25 + 120 }}
              className="absolute glass p-4 rounded-2xl border border-slate-900 bg-slate-950/60 shadow-lg text-xs"
            >
              <div className="flex items-center gap-2 mb-1.5 text-purple-400 font-bold">
                <CreditCard className="h-4 w-4" /> <span>₹84,200 Net pay</span>
              </div>
              <p className="text-[10px] text-slate-500">June compensation ledger summary</p>
            </motion.div>
          </div>

          {/* Left panel Footer */}
          <div className="text-xs text-slate-500">
            <p>Intelligent Human Resources Engine. Powered by secure machine learning configurations.</p>
          </div>
        </div>

        {/* --- RIGHT PANEL: Auth glass form card --- */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-12 relative">
          <div className="w-full max-w-md space-y-6">
            
            {/* Header Title (Logo shown on mobile only) */}
            <div className="text-center lg:text-left space-y-2">
              <div className="flex lg:hidden items-center justify-center gap-2.5 mb-6">
                <div className="bg-gradient-to-tr from-indigo-600 to-purple-500 p-2.5 rounded-xl shadow-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <span className="font-extrabold text-xl tracking-widest text-white">AI-HRMS</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {formMode === 'signin' ? 'Intelligent HR. Powered by AI.' : 'Initialize Enterprise Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {formMode === 'signin' ? 'Sign in to access your administrative workspace.' : 'Register company tenant and deploy local nodes.'}
              </p>
            </div>

            {/* Auth Glass Card wrapper */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-950/40 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              
              {/* Form alerts (success/error) */}
              <AnimatePresence mode="wait">
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-xl text-xs text-red-400 flex items-start gap-2.5 mb-4"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </motion.div>
                )}
                {formSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-400 flex items-start gap-2.5 mb-4"
                  >
                    <CheckSquare className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{formSuccess}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AUTHENTICATION FORMS CONTENT */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                
                {/* --- REGISTER TENANT ONLY FIELDS --- */}
                {formMode === 'signup' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-400">Company Name</label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <Building className="h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="e.g. Initech Corp"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 focus:outline-none w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-400">Full Name</label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <User className="h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Alex Dev"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 focus:outline-none w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-400">Company Phone</label>
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 focus:outline-none w-full"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* --- STANDARD DUAL EMAIL FIELD --- */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-400">Email Address</label>
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl focus-within:border-indigo-500/50 transition-colors">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="admin@hrms.com"
                      value={formMode === 'signin' ? loginEmail : signupEmail}
                      onChange={(e) => formMode === 'signin' ? setLoginEmail(e.target.value) : setSignupEmail(e.target.value)}
                      className="bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 focus:outline-none w-full"
                    />
                  </div>
                </div>

                {/* --- PASSWORD FIELD & STRENGTH BAR --- */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="block font-bold text-slate-400">Password</label>
                    {formMode === 'signin' && (
                      <a href="#" className="text-[10px] text-indigo-400 hover:text-indigo-300">Forgot?</a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl focus-within:border-indigo-500/50 transition-colors">
                    <Lock className="h-4 w-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formMode === 'signin' ? loginPassword : signupPassword}
                      onChange={(e) => formMode === 'signin' ? setLoginPassword(e.target.value) : setSignupPassword(e.target.value)}
                      className="bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength visual indicator (Sign Up only) */}
                  {formMode === 'signup' && signupPassword && (
                    <div className="pt-2 space-y-1.5">
                      <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                        <span>Password Complexity</span>
                        <span>{strengthLabel}</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-900">
                        <div className={`h-full rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: `${passwordStrength}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* --- SIGN UP VERIFICATION CONFIRM PASSWORDS --- */}
                {formMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400">Confirm Password</label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <Lock className="h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                )}

                {/* --- REMEMBER ME OR TERMS CHECKBOXES --- */}
                {formMode === 'signin' ? (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-[10px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span>Remember access keys</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center pt-1">
                    <label className="flex items-start gap-2 text-[10px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 mt-0.5"
                      />
                      <span>I accept the Terms of Use and Privacy Rules</span>
                    </label>
                  </div>
                )}

                {/* --- SUBMIT BTN --- */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110 shadow-lg shadow-indigo-600/10 mt-6 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{formMode === 'signin' ? 'Verify and Enter Workspace' : 'Deploy Company Instance'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* SSO Auth Divider */}
              <div className="my-6 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span className="h-[1px] bg-slate-900 w-[40%]" />
                <span>Or</span>
                <span className="h-[1px] bg-slate-900 w-[40%]" />
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 transition-colors text-xs font-semibold text-slate-300">
                  <Chrome className="h-4 w-4 text-indigo-400" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 transition-colors text-xs font-semibold text-slate-300">
                  <Github className="h-4 w-4 text-indigo-400" /> Microsoft
                </button>
              </div>
            </div>

            {/* Bottom Swapper Link */}
            <div className="text-center text-xs">
              <span className="text-slate-500">
                {formMode === 'signin' ? "Don't have an account? " : "Already have an instance deployed? "}
              </span>
              <button
                onClick={() => {
                  setFormMode(formMode === 'signin' ? 'signup' : 'signin');
                  setFormError('');
                  setFormSuccess('');
                }}
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {formMode === 'signin' ? 'Deploy Instance' : 'Login Credentials'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
