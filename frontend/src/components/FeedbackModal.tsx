import React, { useState } from 'react';
import { X, MessageSquare, ThumbsUp, Frown, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillId: string;
  skillName: string;
  onSubmitted: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  skillId,
  skillName,
  onSubmitted,
}) => {
  const [sentiment, setSentiment] = useState<string>('Comfortable');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const options = [
    { label: 'Struggling', desc: 'Need simpler foundation materials', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { label: 'Need Practice', desc: 'Need extra exercises/projects', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Comfortable', desc: 'Learning at good pace', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { label: 'Confident', desc: 'Ready for advanced topics', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Too Easy', desc: 'Fast-forward / skip this topic', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await api.submitFeedback(skillId, sentiment, comment);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSubmitted();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-primary font-bold text-sm mb-1">
          <Sparkles className="w-5 h-5" />
          <span>ADAPTIVE LEARNING ENGINE</span>
        </div>

        <h3 className="text-lg font-bold text-text-main mb-1">
          How confident are you with {skillName}?
        </h3>
        <p className="text-xs text-text-muted mb-4">
          Your feedback continuously re-ranks recommendations and adapts your learning path.
        </p>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-semantic-success mx-auto animate-bounce" />
            <h4 className="font-bold text-text-main">Feedback Received!</h4>
            <p className="text-xs text-text-muted">PathFinder AI is recalculating your topological roadmap...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSentiment(opt.label)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  sentiment === opt.label
                    ? `${opt.color} border-2 font-semibold shadow-2xs`
                    : 'bg-white text-text-main border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[11px] opacity-75">{opt.desc}</div>
                </div>
                {sentiment === opt.label && <CheckCircle2 className="w-4 h-4" />}
              </button>
            ))}

            <div className="pt-2">
              <label className="block text-xs font-medium text-text-muted mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what resources helped or where you got stuck..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-main"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-sm transition-all"
              >
                {submitting ? 'Adapting Path...' : 'Submit & Update Path'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
