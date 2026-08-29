import React from 'react';
import { Link } from 'react-router-dom';

export const TopHeader: React.FC<{ onOpenMobileSidebar?: () => void }> = () => {
  return (
    <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between">
      <Link to="/" className="text-sm font-bold text-[var(--text-primary)]">
        PathFinder AI
      </Link>
    </header>
  );
};
