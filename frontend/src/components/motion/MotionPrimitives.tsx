import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

// Premium Easing Curves (Apple / Stripe / Linear standard)
export const TRANSITION_EASE = [0.22, 1, 0.36, 1] as const;

// 1. Viewport Scroll Reveal Component
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 20,
}) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay,
        ease: TRANSITION_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const RevealOnScroll = ScrollReveal;

// 2. Shared Page Transition Route Wrapper
export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: TRANSITION_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionPage = PageTransition;

// 3. Staggered Container & Children Item
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}> = ({ children, className = '', staggerDelay = 0.06, delayChildren = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: TRANSITION_EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 4. Premium Tactile Card (Hover lift -2px, subtle shadow)
export const MotionCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.18, ease: TRANSITION_EASE } }}
      whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
      onClick={onClick}
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-6 transition-colors duration-200 hover:border-slate-300 hover:shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
};

// 5. Tactile Button Micro-Interaction Wrapper
export const MotionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
> = ({ children, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ y: -1, transition: { duration: 0.15, ease: TRANSITION_EASE } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

// 6. Smooth Animated Number Count-Up
export const AnimatedNumber: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}> = ({ value, duration = 0.8, suffix = '', prefix = '', decimals = 0, className = '' }) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const targetValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

// 7. Smooth Animated Progress Bar
export const AnimatedProgress: React.FC<{
  value: number;
  className?: string;
  barClassName?: string;
}> = ({ value, className = '', barClassName = '' }) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full bg-[var(--surface-sunken)] h-2 rounded-[var(--radius-pill)] overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.7, ease: TRANSITION_EASE }}
        className={`bg-[var(--brand)] h-full rounded-[var(--radius-pill)] ${barClassName}`}
      />
    </div>
  );
};

// 8. Standardized Modal Transition Wrapper
export const ModalTransition: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.22, ease: TRANSITION_EASE }}
            className={`relative z-10 w-full ${maxWidth}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 9. Reusable Loading Skeleton Primitives
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[var(--surface-sunken)] animate-pulse rounded-[var(--radius-sm)] ${className}`} />
);

export const MetricSkeleton: React.FC = () => (
  <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] space-y-2">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-7 w-14" />
  </div>
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] space-y-3 ${className}`}>
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

// 10. Scroll Progress Bar
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#4F46E5] origin-left z-50 pointer-events-none"
    />
  );
};
