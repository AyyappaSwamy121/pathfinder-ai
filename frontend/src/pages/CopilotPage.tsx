import React, { useState } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { MessageSquareCode, Send, Sparkles, User, Bot, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CopilotPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard } = useLearner();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; message: string; actions?: string[] }>>([
    {
      sender: 'ai',
      message: `Hello Alex! I am your ground-truth AI Copilot. I have full live visibility into your target career (${dashboard?.target_career.title || 'AI Engineer'}), your 64% readiness score, and your next milestone ('Model Evaluation'). How can I help navigate your path today?`,
      actions: ['What should I learn today?', 'Why is Model Evaluation recommended?', 'What project should I build?'],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const promptChips = [
    'What should I learn today?',
    'Why is Model Evaluation recommended?',
    'Can I skip anything?',
    'What project should I build?',
    'I only have 3 hours this week. What should I do?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', message: query }]);
    setLoading(true);

    try {
      const res = await api.sendChatMessage(query);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', message: res.reply, actions: res.suggested_actions },
      ]);
    } catch (err) {
      console.error('Copilot Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          message: 'PathFinder AI Copilot is currently operating in offline mode. Based on your live state, we recommend focusing on Model Evaluation today.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-2">
          <MessageSquareCode className="w-3.5 h-3.5" />
          <span>GROUNDED AI CAREER COPILOT</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
          AI Career Navigation Assistant
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Grounded in your live learner profile, prerequisite graph, and current skill gaps.
        </p>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs h-[500px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary text-white font-medium rounded-br-none'
                    : 'bg-gray-50 border border-gray-200 text-text-main rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.message}</div>

                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-wrap gap-2">
                    {m.actions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        onClick={() => {
                          if (act.includes('Roadmap')) navigate('/roadmap');
                          else if (act.includes('Simulator')) navigate('/simulator');
                          else handleSend(act);
                        }}
                        className="bg-white hover:bg-gray-100 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-semibold text-[11px] shadow-2xs transition-colors flex items-center space-x-1"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-gray-200 text-text-main flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-primary font-semibold text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing live context state...</span>
            </div>
          )}
        </div>

        {/* Input & Prompt Chips */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex flex-wrap gap-2">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="bg-primary-soft/60 hover:bg-primary-soft text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/20 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot what to learn today or why a skill is recommended..."
              className="flex-1 text-xs p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
