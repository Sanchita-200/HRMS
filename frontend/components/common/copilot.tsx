'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '../../lib/context';
import { Bot, Send, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Copilot: React.FC = () => {
  const { copilotOpen, setCopilotOpen, chatMessages, sendChatMessage } = useUI();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Apply leave tomorrow',
    'Explain salary deduction',
    'Show attendance this month',
    'Find employees absent > 5 days'
  ];

  // Auto-scroll chat to bottom when messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, copilotOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setCopilotOpen(!copilotOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-500 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform border border-indigo-400/20"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Floating Chat Interface */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[500px] glass border border-slate-900 rounded-3xl flex flex-col justify-between shadow-2xl overflow-hidden bg-slate-950/95"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-950/40 to-slate-950 p-4 border-b border-slate-900 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-indigo-600/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI HR Copilot</h3>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed border ${
                        isUser
                          ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input and Prompt Templates */}
            <div className="p-4 border-t border-slate-900 space-y-3">
              {/* Sample Quick Prompts (only shown if messages are minimal) */}
              {chatMessages.length <= 2 && (
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendChatMessage(prompt)}
                      className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Field */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:ring-0 focus:outline-none px-2"
                />
                <button
                  onClick={handleSend}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
