import React, { useState } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { MessageSquareCode, Send, Sparkles, ShieldCheck, User, Bot, Clock } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const CopilotPage: React.FC = () => {
  const { dashboard } = useLearner();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello Alex! I'm grounded in your live learner profile for ${dashboard?.target_career.title || 'AI Engineer'} (${Math.round(dashboard?.readiness_score || 64)}% readiness). How can I assist your career path today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const quickPrompts = [
    'What should I learn today?',
    'Why is Model Evaluation recommended?',
    'How can I reach my goal faster?',
    'What if I switch to Data Scientist?',
  ];

  const handleSend = async (msgText?: string) => {
    const textToSend = msgText || input;
    if (!textToSend.trim() || sending) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!msgText) setInput('');
    setSending(true);

    try {
      const res = await api.sendChatMessage(textToSend);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'PathFinder Copilot is operating in offline fallback mode. Check your personalized roadmap for immediate recommendations.' },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Learner Context */}
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
            CONTEXT-GROUNDED CAREER ASSISTANT
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            PathFinder AI Career Copilot
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Grounded in live readiness scores, active skill gaps, satisfied prerequisites, and roadmap state
          </p>
        </div>

        {/* Live Context Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs flex items-center space-x-3">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Live Context</div>
            <div className="font-bold text-slate-900">{dashboard?.target_career.title}</div>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Readiness</div>
            <div className="font-mono font-bold text-primary">{Math.round(dashboard?.readiness_score || 64)}%</div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-surface border border-slate-200 rounded-lg shadow-subtle flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-primary text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 font-normal'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 animate-pulse">
              <Bot className="w-4 h-4 text-primary" />
              <span>Copilot is analyzing profile context...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts & Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-medium bg-surface hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot about your career path, skill gaps, or prerequisites..."
              className="flex-1 p-2.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none bg-surface"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sending}
              className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-md text-xs font-semibold shadow-subtle disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
