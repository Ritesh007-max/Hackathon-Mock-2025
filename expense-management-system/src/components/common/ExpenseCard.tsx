'use client';

import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Receipt, Calendar, DollarSign, Tag } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function ExpenseCard({ 
  expense, 
  showActions = false, 
  onApprove, 
  onReject 
}: ExpenseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{expense.description}</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
            {expense.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span>{formatCurrency(expense.amount, expense.currency)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Tag className="h-4 w-4" />
          <span className="capitalize">{expense.category}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(expense.date)}</span>
        </div>

        {expense.receiptUrl && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Receipt className="h-4 w-4" />
            <span>Receipt attached</span>
          </div>
        )}

        {expense.comments && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Comments:</strong> {expense.comments}
          </div>
        )}

        {showActions && expense.status === 'pending' && (
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => onApprove?.(expense.id)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => onReject?.(expense.id)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}