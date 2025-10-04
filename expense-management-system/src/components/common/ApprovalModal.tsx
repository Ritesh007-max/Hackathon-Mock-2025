'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (comments?: string) => void;
  onReject: (comments?: string) => void;
  expenseId: string;
}

export default function ApprovalModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  expenseId
}: ApprovalModalProps) {
  const [comments, setComments] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(comments);
    } else if (action === 'reject') {
      onReject(comments);
    }
    setComments('');
    setAction(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Review Expense</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments about this expense..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setAction('reject')}
              className={action === 'reject' ? 'bg-red-50 border-red-300' : ''}
            >
              Reject
            </Button>
            <Button
              onClick={() => setAction('approve')}
              className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Approve
            </Button>
          </div>

          {action && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}