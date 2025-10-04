'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpenseCard } from '@/components/expense-card';
import { ApprovalModal } from '@/components/approval-modal';
import { api } from '@/lib/api';
import { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { 
  Receipt, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckSquare
} from 'lucide-react';

export function ManagerDashboard() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: pendingExpenses = [], isLoading } = useQuery({
    queryKey: ['pendingExpenses'],
    queryFn: api.getPendingExpenses,
  });

  const approveMutation = useMutation({
    mutationFn: ({ expenseId, comment }: { expenseId: string; comment?: string }) =>
      api.approveExpense(expenseId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingExpenses'] });
      setShowApprovalModal(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ expenseId, comment }: { expenseId: string; comment?: string }) =>
      api.rejectExpense(expenseId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingExpenses'] });
      setShowApprovalModal(false);
    },
  });

  const handleApprove = (expenseId: string, comment?: string) => {
    approveMutation.mutate({ expenseId, comment });
  };

  const handleReject = (expenseId: string, comment?: string) => {
    rejectMutation.mutate({ expenseId, comment });
  };

  const handleExpenseAction = (expenseId: string, action: 'approve' | 'reject') => {
    const expense = pendingExpenses.find(e => e.id === expenseId);
    if (expense) {
      setSelectedExpense(expense);
      setShowApprovalModal(true);
    }
  };

  const totalPendingAmount = pendingExpenses.reduce((sum, expense) => sum + expense.convertedAmount, 0);
  const urgentExpenses = pendingExpenses.filter(e => {
    const daysSinceSubmission = Math.floor(
      (Date.now() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceSubmission > 3;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pendingExpenses.length} Pending Reviews
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPendingAmount, 'USD')}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Need your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentExpenses}</div>
            <p className="text-xs text-muted-foreground">
              Over 3 days old
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingExpenses.length > 0 
                ? formatCurrency(totalPendingAmount / pendingExpenses.length, 'USD')
                : '$0.00'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Per expense
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>Expenses Awaiting Approval</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : pendingExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm">No expenses pending your approval</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Click on any expense to review and approve or reject
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingExpenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    showActions={true}
                    onApprove={() => handleExpenseAction(expense.id, 'approve')}
                    onReject={() => handleExpenseAction(expense.id, 'reject')}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Modal */}
      <ApprovalModal
        expense={selectedExpense}
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}