import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { Send, User, Bot } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AnimatedNumber, TRANSITION_EASE } from '../components/motion/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const CopilotPage: React.FC = () => {
  const { dashboard } = useLearner();
  const targetTitle = dashboard?.target_career?.title || 'AI Engineer';
  const readiness = Math.round(dashboard?.readiness_score || 64);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello! I'm grounded in your live profile for ${targetTitle} (${readiness}% readiness). How can I assist your career path today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

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
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply || 'Analysis complete.' }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'PathFinder Copilot is operating in offline fallback mode. Check your personalized roadmap for immediate recommendations.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: TRANSITION_EASE }}
      >
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
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
              <div className="font-bold text-[var(--text-primary)]">{targetTitle}</div>
            </div>
            <div className="border-l border-[var(--border)] pl-3">
              <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase">Readiness</div>
              <div className="font-mono font-bold text-[var(--brand)]">
                <AnimatedNumber value={readiness} suffix="%" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Chat Interface */}
      <Card className="flex flex-col h-[520px] p-0 overflow-hidden hover:border-slate-300 transition-colors">
        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: TRANSITION_EASE }}
                className={`flex items-start gap-3 max-w-2xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                    msg.sender === 'user'
                      ? 'bg-[var(--text-primary)] text-white'
                      : 'bg-[var(--brand)] text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-[var(--radius-md)] text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[var(--text-primary)] text-white font-medium'
                      : 'bg-[var(--surface-sunken)] text-[var(--text-primary)] border border-[var(--border)] font-normal'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {sending && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 text-xs text-[var(--text-tertiary)] py-1"
            >
              <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--brand)] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-md)] px-3.5 py-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[11px] text-[var(--text-secondary)]">Analyzing context...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompts & Input Bar */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-sunken)] space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, pIdx) => (
              <motion.button
                key={pIdx}
                whileHover={{ y: -1, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-medium bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--border)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-[var(--radius-sm)] transition-colors cursor-pointer"
              >
                {prompt}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot about your career path, skill gaps, or prerequisites..."
              className="flex-1 p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] bg-[var(--surface)] transition-colors"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="md"
                variant="primary"
                disabled={!input.trim() || sending}
                onClick={() => handleSend()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
};
