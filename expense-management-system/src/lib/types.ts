export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  managerId?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  currency: string;
  country: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  companyCurrency: string;
  category: string;
  description: string;
  date: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalLevel: number;
  approvers: string[];
  approvals: Approval[];
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  expenseId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  createdAt: string;
}

export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  rules: ApprovalRuleStep[];
  createdAt: string;
}

export interface ApprovalRuleStep {
  id: string;
  level: number;
  approverRole: UserRole;
  condition?: {
    type: 'percentage' | 'amount' | 'category';
    value: number | string;
  };
  autoApprove?: boolean;
}

export interface AuthContextType {
  user: User | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}