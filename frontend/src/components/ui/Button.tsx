import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-xs hover:-translate-y-[1px]',
        secondary: 'bg-white text-[#111827] border border-[#D1D5DB] hover:bg-[#FAFAF9] shadow-2xs hover:-translate-y-[1px]',
        ghost: 'text-[#4B5563] hover:bg-[#F5F5F4] hover:text-[#111827]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-xs',
        lg: 'h-11 px-6 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={twMerge(button({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';
