'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExpenseCard from '@/components/common/ExpenseCard';
import ApprovalModal from '@/components/common/ApprovalModal';
import { Expense } from '@/types';
import { CheckCircle, Clock, Filter } from 'lucide-react';

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
  {
    id: '3',
    userId: '2',
    amount: 200.00,
    currency: 'USD',
    category: 'travel',
    description: 'Hotel accommodation for conference',
    date: '2024-01-17',
    receiptUrl: '/receipt3.jpg',
    status: 'rejected',
    approvalLevel: 1,
    approvers: ['manager1'],
    comments: 'Expense exceeds policy limit',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T15:00:00Z',
  },
];

export default function ApprovalsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: expenses = mockExpenses, isLoading } = useQuery({
    queryKey: ['approvals-expenses'],
    queryFn: async () => {
      // Mock API call
      return mockExpenses;
    },
  });

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.status === filter;
  });

  const handleApprove = (expenseId: string, comments?: string) => {
    console.log('Approving expense:', expenseId, comments);
    // TODO: Implement approval logic
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const handleReject = (expenseId: string, comments?: string) => {
    console.log('Rejecting expense:', expenseId, comments);
    // TODO: Implement rejection logic
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const openModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const stats = {
    total: expenses.length,
    pending: expenses.filter(e => e.status === 'pending').length,
    approved: expenses.filter(e => e.status === 'approved').length,
    rejected: expenses.filter(e => e.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Approvals</h1>
          <p className="text-gray-600">Review and manage expense approvals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <CheckCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex space-x-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              showActions={expense.status === 'pending'}
              onApprove={() => openModal(expense)}
              onReject={() => openModal(expense)}
            />
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No expenses have been submitted yet.' 
                  : `No expenses with status "${filter}" found.`
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Approval Modal */}
        <ApprovalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={(comments) => selectedExpense && handleApprove(selectedExpense.id, comments)}
          onReject={(comments) => selectedExpense && handleReject(selectedExpense.id, comments)}
          expenseId={selectedExpense?.id || ''}
        />
      </div>
    </ProtectedRoute>
  );
}