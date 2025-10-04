'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Expense } from '@/lib/types';
import { Receipt, Calendar, DollarSign, Tag } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  showActions?: boolean;
  onApprove?: (expenseId: string) => void;
  onReject?: (expenseId: string) => void;
}

export function ExpenseCard({ expense, showActions = false, onApprove, onReject }: ExpenseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {formatCurrency(expense.amount, expense.currency)}
          </CardTitle>
          <Badge className={getStatusColor(expense.status)}>
            {expense.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Tag className="w-4 h-4" />
            <span>{expense.category}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(expense.date)}</span>
          </div>
          {expense.receiptUrl && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Receipt className="w-4 h-4" />
              <span>Receipt attached</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-700">
          <p className="font-medium">Description:</p>
          <p className="text-gray-600">{expense.description}</p>
        </div>

        {expense.convertedAmount !== expense.amount && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Converted: </span>
            {formatCurrency(expense.convertedAmount, expense.companyCurrency)}
          </div>
        )}

        {expense.approvals.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Approval History:</p>
            <div className="space-y-1">
              {expense.approvals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    Level {expense.approvals.indexOf(approval) + 1}
                  </span>
                  <Badge 
                    className={`text-xs ${getStatusColor(approval.status)}`}
                  >
                    {approval.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {showActions && expense.status === 'pending' && (
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              onClick={() => onApprove?.(expense.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject?.(expense.id)}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}