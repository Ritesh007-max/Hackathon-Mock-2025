'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExpenseCard from '@/components/common/ExpenseCard';
import ApprovalModal from '@/components/common/ApprovalModal';
import { Expense } from '@/types';
import { CheckCircle, Clock, DollarSign, Users } from 'lucide-react';

// Mock data for demo
const mockPendingExpenses: Expense[] = [
  {
    id: '3',
    userId: '2',
    amount: 200.00,
    currency: 'USD',
    category: 'travel',
    description: 'Hotel accommodation for conference',
    date: '2024-01-17',
    receiptUrl: '/receipt3.jpg',
    status: 'pending',
    approvalLevel: 1,
    approvers: ['manager1'],
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
  },
  {
    id: '4',
    userId: '3',
    amount: 45.00,
    currency: 'USD',
    category: 'meals',
    description: 'Team lunch',
    date: '2024-01-18',
    status: 'pending',
    approvalLevel: 1,
    approvers: ['manager1'],
    createdAt: '2024-01-18T12:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
  },
];

export default function ManagerDashboard() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: pendingExpenses = mockPendingExpenses, isLoading } = useQuery({
    queryKey: ['manager-pending-expenses'],
    queryFn: async () => {
      // Mock API call
      return mockPendingExpenses;
    },
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
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Review and approve expense submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingExpenses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Expenses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Expenses Awaiting Approval</h2>
        
        {pendingExpenses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No expenses are currently awaiting your approval.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                showActions={true}
                onApprove={() => openModal(expense)}
                onReject={() => openModal(expense)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={(comments) => selectedExpense && handleApprove(selectedExpense.id, comments)}
        onReject={(comments) => selectedExpense && handleReject(selectedExpense.id, comments)}
        expenseId={selectedExpense?.id || ''}
      />
    </div>
  );
}