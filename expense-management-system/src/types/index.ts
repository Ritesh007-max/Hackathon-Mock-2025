export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
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
  category: string;
  description: string;
  date: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalLevel: number;
  approvers: string[];
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  rules: ApprovalStep[];
  createdAt: string;
}

export interface ApprovalStep {
  id: string;
  role: UserRole;
  userId?: string;
  condition?: {
    type: 'percentage' | 'amount';
    value: number;
  };
  autoApprove?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface Country {
  name: {
    common: string;
  };
  currencies: Record<string, {
    name: string;
    symbol: string;
  }>;
}