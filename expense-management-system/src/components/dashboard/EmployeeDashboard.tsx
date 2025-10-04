'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ExpenseCard from '@/components/common/ExpenseCard';
import { Expense } from '@/types';
import { Plus, DollarSign, FileText, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data for demo
const mockExpenses: Expense[] = [
  {
    id: '1',
    userId: '1',
    amount: 150.00,
    currency: 'USD',
    category: 'meals',
    description: 'Business lunch with client',
    date: '2024-01-15',
    receiptUrl: '/receipt1.jpg',
    status: 'approved',
    approvalLevel: 2,
    approvers: ['manager1', 'finance1'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    amount: 75.50,
    currency: 'USD',
    category: 'transportation',
    description: 'Taxi to airport',
    date: '2024-01-16',
    status: 'pending',
    approvalLevel: 1,
    approvers: ['manager1'],
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z',
  },
];

export default function EmployeeDashboard() {
  const { data: expenses = mockExpenses, isLoading } = useQuery({
    queryKey: ['employee-expenses'],
    queryFn: async () => {
      // Mock API call
      return mockExpenses;
    },
  });

  const stats = {
    totalExpenses: expenses.length,
    pendingExpenses: expenses.filter(e => e.status === 'pending').length,
    approvedExpenses: expenses.filter(e => e.status === 'approved').length,
    rejectedExpenses: expenses.filter(e => e.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
        <p className="text-gray-600">Track and manage your expense submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExpenses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingExpenses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedExpenses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedExpenses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Expenses</h2>
        <Link href="/submit-expense">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Submit New Expense</span>
          </Button>
        </Link>
      </div>

      {/* Expenses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>

      {expenses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600 mb-4">Start by submitting your first expense</p>
            <Link href="/submit-expense">
              <Button>Submit Expense</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}