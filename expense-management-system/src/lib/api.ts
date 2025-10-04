import { Expense, User, Company, ApprovalRule } from './types';

// Mock API endpoints - replace with actual backend URLs
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  signup: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) throw new Error('Signup failed');
    return response.json();
  },

  // User endpoints
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  // Expense endpoints
  getExpenses: async (): Promise<Expense[]> => {
    const response = await fetch(`${API_BASE}/expenses`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },

  getExpensesByUser: async (userId: string): Promise<Expense[]> => {
    const response = await fetch(`${API_BASE}/expenses/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user expenses');
    return response.json();
  },

  getPendingExpenses: async (): Promise<Expense[]> => {
    const response = await fetch(`${API_BASE}/expenses/pending`);
    if (!response.ok) throw new Error('Failed to fetch pending expenses');
    return response.json();
  },

  createExpense: async (expenseData: Partial<Expense>): Promise<Expense> => {
    const response = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },

  approveExpense: async (expenseId: string, comment?: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/expenses/${expenseId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });
    if (!response.ok) throw new Error('Failed to approve expense');
  },

  rejectExpense: async (expenseId: string, comment?: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/expenses/${expenseId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });
    if (!response.ok) throw new Error('Failed to reject expense');
  },

  // Approval rules endpoints
  getApprovalRules: async (): Promise<ApprovalRule[]> => {
    const response = await fetch(`${API_BASE}/approval-rules`);
    if (!response.ok) throw new Error('Failed to fetch approval rules');
    return response.json();
  },

  createApprovalRule: async (ruleData: Partial<ApprovalRule>): Promise<ApprovalRule> => {
    const response = await fetch(`${API_BASE}/approval-rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData),
    });
    if (!response.ok) throw new Error('Failed to create approval rule');
    return response.json();
  },

  // External APIs
  getCountries: async () => {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
    if (!response.ok) throw new Error('Failed to fetch countries');
    return response.json();
  },

  getExchangeRate: async (baseCurrency: string) => {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (!response.ok) throw new Error('Failed to fetch exchange rate');
    return response.json();
  },
};