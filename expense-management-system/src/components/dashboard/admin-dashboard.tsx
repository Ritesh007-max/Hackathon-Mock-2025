'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpenseCard } from '@/components/expense-card';
import { RuleBuilder } from '@/components/rule-builder';
import { ApprovalModal } from '@/components/approval-modal';
import { api } from '@/lib/api';
import { Expense, ApprovalRule } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { 
  Users, 
  Receipt, 
  CheckSquare, 
  DollarSign,
  TrendingUp,
  Settings
} from 'lucide-react';

export function AdminDashboard() {
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: api.getExpenses,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  const { data: approvalRules = [] } = useQuery({
    queryKey: ['approvalRules'],
    queryFn: api.getApprovalRules,
  });

  const approveMutation = useMutation({
    mutationFn: ({ expenseId, comment }: { expenseId: string; comment?: string }) =>
      api.approveExpense(expenseId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowApprovalModal(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ expenseId, comment }: { expenseId: string; comment?: string }) =>
      api.rejectExpense(expenseId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowApprovalModal(false);
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: api.createApprovalRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvalRules'] });
      setShowRuleBuilder(false);
    },
  });

  const handleApprove = (expenseId: string, comment?: string) => {
    approveMutation.mutate({ expenseId, comment });
  };

  const handleReject = (expenseId: string, comment?: string) => {
    rejectMutation.mutate({ expenseId, comment });
  };

  const handleExpenseAction = (expenseId: string, action: 'approve' | 'reject') => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      setSelectedExpense(expense);
      setShowApprovalModal(true);
    }
  };

  const handleSaveRule = (ruleData: Partial<ApprovalRule>) => {
    createRuleMutation.mutate(ruleData);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.convertedAmount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
  const rejectedExpenses = expenses.filter(e => e.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button onClick={() => setShowRuleBuilder(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Manage Approval Rules
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses, 'USD')}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} total expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedExpenses}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Active users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>Recent Expenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenses.slice(0, 6).map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  showActions={expense.status === 'pending'}
                  onApprove={() => handleExpenseAction(expense.id, 'approve')}
                  onReject={() => handleExpenseAction(expense.id, 'reject')}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {approvalRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No approval rules configured
            </div>
          ) : (
            <div className="space-y-4">
              {approvalRules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{rule.name}</h3>
                    <Badge variant="outline">{rule.rules.length} steps</Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {rule.rules.map((step, index) => (
                      <span key={step.id}>
                        {index > 0 && ' → '}
                        {step.approverRole}
                        {step.autoApprove && ' (Auto)'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rule Builder Modal */}
      {showRuleBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <RuleBuilder
                onSave={handleSaveRule}
                onCancel={() => setShowRuleBuilder(false)}
              />
            </div>
          </div>
        </div>
      )}

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