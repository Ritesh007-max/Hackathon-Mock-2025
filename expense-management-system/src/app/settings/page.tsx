'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Company, ApprovalRule } from '@/types';
import { Settings as SettingsIcon, Building, Shield, Bell } from 'lucide-react';

// Mock data for demo
const mockCompany: Company = {
  id: '1',
  name: 'Acme Corporation',
  currency: 'USD',
  country: 'United States',
  createdAt: '2024-01-01T00:00:00Z',
};

const mockApprovalRules: ApprovalRule[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Standard Approval Flow',
    rules: [
      {
        id: '1',
        role: 'manager',
        condition: { type: 'amount', value: 100 },
      },
      {
        id: '2',
        role: 'admin',
        condition: { type: 'amount', value: 500 },
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'approval' | 'notifications'>('company');
  const [companyData, setCompanyData] = useState(mockCompany);
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const { data: company = mockCompany } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      // Mock API call
      return mockCompany;
    },
  });

  const { data: approvalRules = mockApprovalRules } = useQuery({
    queryKey: ['approval-rules'],
    queryFn: async () => {
      // Mock API call
      return mockApprovalRules;
    },
  });

  const handleCompanyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating company:', companyData);
    // TODO: Implement company update logic
    setIsEditingCompany(false);
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'approval', label: 'Approval Rules', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Company Information</h2>
              <Button onClick={() => setIsEditingCompany(true)}>
                Edit Company
              </Button>
            </div>

            {isEditingCompany ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Company Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCompanyUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select
                        id="currency"
                        value={companyData.currency}
                        onChange={(e) => setCompanyData({ ...companyData, currency: e.target.value })}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={companyData.country}
                        onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit">Save Changes</Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditingCompany(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                      <p className="text-lg">{company.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Default Currency</Label>
                      <p className="text-lg">{company.currency}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Country</Label>
                      <p className="text-lg">{company.country}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created</Label>
                      <p className="text-lg">{new Date(company.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'approval':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Approval Rules</h2>
              <Button>Create New Rule</Button>
            </div>

            <div className="space-y-4">
              {approvalRules.map((rule) => (
                <Card key={rule.id}>
                  <CardHeader>
                    <CardTitle>{rule.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {rule.rules.map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-2 text-sm">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="capitalize">{step.role}</span>
                          {step.condition && (
                            <span className="text-gray-500">
                              (if amount {step.condition.type === 'amount' ? '>' : '>='} ${step.condition.value})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {approvalRules.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No approval rules configured</h3>
                  <p className="text-gray-600 mb-4">Set up approval workflows for your organization</p>
                  <Button>Create First Rule</Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Expense Submitted</Label>
                    <p className="text-xs text-gray-500">Get notified when expenses are submitted</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Expense Approved</Label>
                    <p className="text-xs text-gray-500">Get notified when your expenses are approved</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Expense Rejected</Label>
                    <p className="text-xs text-gray-500">Get notified when your expenses are rejected</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Approval Required</Label>
                    <p className="text-xs text-gray-500">Get notified when expenses need your approval</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Expense Summary</Label>
                    <p className="text-xs text-gray-500">Weekly summary of all expenses</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Pending Approvals</Label>
                    <p className="text-xs text-gray-500">Weekly report of pending approvals</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and organization settings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </ProtectedRoute>
  );
}