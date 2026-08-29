import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]',
        secondary: 'bg-white text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--surface-sunken)]',
        ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={button({ variant, size, className })} {...props} />
  )
);
Button.displayName = 'Button';
