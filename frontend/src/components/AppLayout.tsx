import React from 'react';
import { AppShell } from './layout/AppShell';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppShell>{children}</AppShell>;
};
