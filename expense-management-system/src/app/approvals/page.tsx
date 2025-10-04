'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { ManagerDashboard } from '@/components/dashboard/manager-dashboard';

export default function ApprovalsPage() {
  return (
    <MainLayout>
      <ManagerDashboard />
    </MainLayout>
  );
}