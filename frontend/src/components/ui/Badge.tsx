import { type HTMLAttributes } from 'react';

const tones = {
  neutral: 'bg-[var(--surface-sunken)] text-[var(--text-secondary)]',
  brand: 'bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand-soft-border)]',
  success: 'bg-[var(--success-soft)] text-[var(--success)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  danger: 'bg-[var(--danger-soft)] text-[var(--danger)]',
} as const;

export function Badge({
  tone = 'neutral',
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-[var(--radius-pill)] text-xs font-medium ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
