'use client';

import { useAuth } from '@/lib/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { ManagerDashboard } from '@/components/dashboard/manager-dashboard';
import { EmployeeDashboard } from '@/components/dashboard/employee-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <MainLayout>
      {renderDashboard()}
    </MainLayout>
  );
}