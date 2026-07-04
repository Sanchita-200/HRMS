'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'employee';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface UIContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  isCheckedIn: boolean;
  setCheckedIn: (checked: boolean) => void;
  checkInTime: string | null;
  setCheckInTime: (time: string | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [isCheckedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your AI HR Copilot. Ask me anything about leave requests, check-ins, or payroll details.',
      timestamp: new Date()
    }
  ]);

  // Handle auto-collapsing sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Simulate AI response stream
    setTimeout(() => {
      let reply = "I'm analyzing your request. Since the backend services are in placeholder state, this is simulated. Soon, I will be wired to ChromaDB and LangGraph!";
      
      const query = text.toLowerCase();
      if (query.includes('leave')) {
        reply = "You currently have 14 days of Paid Leave remaining. Would you like me to draft a leave request for tomorrow?";
      } else if (query.includes('payroll') || query.includes('salary') || query.includes('deduction')) {
        reply = "Your net salary for June is $8,420. Deductions ($450) comprise tax withholdings and standard health insurance premiums.";
      } else if (query.includes('attendance') || query.includes('check')) {
        reply = "Your attendance rate for this month is 94%. You have checked in at 9:02 AM today.";
      } else if (query.includes('absent')) {
        reply = "Let me search the records. Employees absent for more than 5 days this month: John Doe (Sales, 6 days) and Sarah Connor (Operations, 5 days).";
      } else if (query.includes('burnout')) {
        reply = "AI Analysis: Attrition risk is high in Engineering due to recent overtime trends. Burnout risk warnings: Alice Vance (92% risk), David Miller (84% risk).";
      }

      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'assistant',
        text: reply,
        timestamp: new Date()
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <UIContext.Provider
      value={{
        role,
        setRole,
        sidebarOpen,
        setSidebarOpen,
        copilotOpen,
        setCopilotOpen,
        chatMessages,
        sendChatMessage,
        isCheckedIn,
        setCheckedIn,
        checkInTime,
        setCheckInTime
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
