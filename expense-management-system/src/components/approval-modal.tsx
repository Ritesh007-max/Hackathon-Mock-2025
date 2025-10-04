'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ApprovalModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (expenseId: string, comment?: string) => void;
  onReject: (expenseId: string, comment?: string) => void;
}

export function ApprovalModal({ 
  expense, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: ApprovalModalProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!expense) return;
    setLoading(true);
    try {
      await onApprove(expense.id, comment);
      setComment('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!expense) return;
    setLoading(true);
    try {
      await onReject(expense.id, comment);
      setComment('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Expense</DialogTitle>
          <DialogDescription>
            Review the expense details and provide your decision with optional comments.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>{formatCurrency(expense.amount, expense.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Category:</span>
              <span>{expense.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{formatDate(expense.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Description:</span>
              <span className="text-right max-w-[200px]">{expense.description}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Add any comments about your decision..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading}
          >
            {loading ? 'Rejecting...' : 'Reject'}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Approving...' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}