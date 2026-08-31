import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { TopHeader } from '../TopHeader';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      {/* Left Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-[250px] flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <TopHeader onOpenMobileSidebar={() => setMobileOpen(true)} />

        {/* Page Content Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
