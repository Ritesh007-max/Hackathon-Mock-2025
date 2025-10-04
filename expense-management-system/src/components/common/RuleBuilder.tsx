'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ApprovalStep, UserRole } from '@/types';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface RuleBuilderProps {
  onSave: (rule: { name: string; steps: ApprovalStep[] }) => void;
  onCancel: () => void;
}

export default function RuleBuilder({ onSave, onCancel }: RuleBuilderProps) {
  const [ruleName, setRuleName] = useState('');
  const [steps, setSteps] = useState<ApprovalStep[]>([
    {
      id: '1',
      role: 'manager',
      condition: { type: 'amount', value: 100 },
    },
  ]);

  const addStep = () => {
    const newStep: ApprovalStep = {
      id: (steps.length + 1).toString(),
      role: 'employee',
      condition: { type: 'amount', value: 0 },
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, field: string, value: any) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const updateCondition = (stepId: string, field: string, value: any) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            condition: step.condition 
              ? { ...step.condition, [field]: value }
              : { type: 'amount', value: 0, [field]: value }
          }
        : step
    ));
  };

  const handleSave = () => {
    if (!ruleName.trim()) {
      alert('Please enter a rule name');
      return;
    }
    onSave({ name: ruleName, steps });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Create Approval Rule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input
            id="rule-name"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="e.g., Standard Approval Flow"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>Approval Steps</Label>
            <Button onClick={addStep} size="sm" className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Step</span>
            </Button>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">Step {index + 1}</span>
                  </div>
                  {steps.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeStep(step.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`role-${step.id}`}>Approver Role</Label>
                    <Select
                      id={`role-${step.id}`}
                      value={step.role}
                      onChange={(e) => updateStep(step.id, 'role', e.target.value)}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`condition-type-${step.id}`}>Condition Type</Label>
                    <Select
                      id={`condition-type-${step.id}`}
                      value={step.condition?.type || 'amount'}
                      onChange={(e) => updateCondition(step.id, 'type', e.target.value)}
                    >
                      <option value="amount">Amount Threshold</option>
                      <option value="percentage">Percentage</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`condition-value-${step.id}`}>Condition Value</Label>
                    <Input
                      id={`condition-value-${step.id}`}
                      type="number"
                      value={step.condition?.value || 0}
                      onChange={(e) => updateCondition(step.id, 'value', parseFloat(e.target.value))}
                      placeholder={step.condition?.type === 'percentage' ? '60' : '100'}
                    />
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rule Preview */}
        <div>
          <Label>Rule Preview</Label>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700">
              {JSON.stringify({ name: ruleName, steps }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleSave} className="flex-1">
            Save Rule
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}