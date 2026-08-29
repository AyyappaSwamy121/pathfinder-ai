import { type HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-6 ${className}`}
      {...props}
    />
  );
}
