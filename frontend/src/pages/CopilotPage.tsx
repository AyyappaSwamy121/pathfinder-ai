import React, { useState } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { Send, User, Bot } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const CopilotPage: React.FC = () => {
  const { dashboard } = useLearner();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello Alex! I'm grounded in your live profile for ${dashboard?.target_career.title || 'AI Engineer'} (${Math.round(dashboard?.readiness_score || 64)}% readiness). How can I assist your career path today?`,
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
      {/* Header */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1">
            <Badge tone="brand">CONTEXT-GROUNDED ASSISTANT</Badge>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            PathFinder Copilot
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Grounded in live readiness scores, active skill gaps, satisfied prerequisites, and roadmap state
          </p>
        </div>

        <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 text-xs flex items-center gap-3">
          <div>
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase">Context</div>
            <div className="font-bold text-[var(--text-primary)]">{dashboard?.target_career.title}</div>
          </div>
          <div className="border-l border-[var(--border)] pl-3">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase">Readiness</div>
            <div className="font-mono font-bold text-[var(--brand)]">{Math.round(dashboard?.readiness_score || 64)}%</div>
          </div>
        </div>
      </Card>

      {/* Main Chat Interface */}
      <Card className="flex flex-col h-[520px] p-0 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 max-w-2xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-[var(--text-primary)] text-white' : 'bg-[var(--brand)] text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-[var(--radius-md)] text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[var(--text-primary)] text-white font-medium'
                    : 'bg-[var(--surface-sunken)] text-[var(--text-primary)] border border-[var(--border)] font-normal'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
              <Bot className="w-4 h-4 text-[var(--brand)]" />
              <span>Analyzing context...</span>
            </div>
          )}
        </div>

        {/* Prompts & Input Bar */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-sunken)] space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-medium bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--border)] px-2.5 py-1 rounded-[var(--radius-sm)] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot about your career path, skill gaps, or prerequisites..."
              className="flex-1 p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] bg-[var(--surface)]"
            />
            <Button size="md" variant="primary" disabled={!input.trim() || sending} onClick={() => handleSend()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
