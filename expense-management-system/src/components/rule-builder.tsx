'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApprovalRule, ApprovalRuleStep, UserRole } from '@/lib/types';
import { Plus, Trash2, Eye } from 'lucide-react';

interface RuleBuilderProps {
  rule?: ApprovalRule;
  onSave: (rule: Partial<ApprovalRule>) => void;
  onCancel: () => void;
}

export function RuleBuilder({ rule, onSave, onCancel }: RuleBuilderProps) {
  const [name, setName] = useState(rule?.name || '');
  const [steps, setSteps] = useState<ApprovalRuleStep[]>(
    rule?.rules || [
      {
        id: '1',
        level: 1,
        approverRole: 'manager',
        autoApprove: false,
      }
    ]
  );
  const [showPreview, setShowPreview] = useState(false);

  const addStep = () => {
    const newStep: ApprovalRuleStep = {
      id: Date.now().toString(),
      level: steps.length + 1,
      approverRole: 'manager',
      autoApprove: false,
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    if (steps.length > 1) {
      const updatedSteps = steps.filter(step => step.id !== stepId);
      // Reorder levels
      const reorderedSteps = updatedSteps.map((step, index) => ({
        ...step,
        level: index + 1,
      }));
      setSteps(reorderedSteps);
    }
  };

  const updateStep = (stepId: string, updates: Partial<ApprovalRuleStep>) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    const ruleData: Partial<ApprovalRule> = {
      name: name.trim(),
      rules: steps,
    };
    
    onSave(ruleData);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Approval Rule Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ruleName">Rule Name</Label>
            <Input
              id="ruleName"
              placeholder="Enter rule name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Approval Steps</Label>
              <Button onClick={addStep} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Step
              </Button>
            </div>

            {steps.map((step, index) => (
              <Card key={step.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Step {step.level}</Badge>
                      <span className="text-sm font-medium">Approval Level</span>
                    </div>
                    {steps.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeStep(step.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Approver Role</Label>
                      <Select
                        value={step.approverRole}
                        onValueChange={(value: UserRole) => 
                          updateStep(step.id, { approverRole: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Auto Approve</Label>
                      <Select
                        value={step.autoApprove ? 'true' : 'false'}
                        onValueChange={(value) => 
                          updateStep(step.id, { autoApprove: value === 'true' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">Manual Review</SelectItem>
                          <SelectItem value="true">Auto Approve</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Condition (Optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <Select
                        value={step.condition?.type || ''}
                        onValueChange={(value) => 
                          updateStep(step.id, { 
                            condition: { 
                              type: value as 'percentage' | 'amount' | 'category',
                              value: step.condition?.value || ''
                            }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Condition type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {step.condition?.type && (
                        <Input
                          placeholder="Condition value"
                          value={step.condition.value}
                          onChange={(e) => 
                            updateStep(step.id, { 
                              condition: { 
                                type: step.condition?.type || 'percentage',
                                value: e.target.value
                              }
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide' : 'Show'} Preview
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Rule
          </Button>
        </div>
      </div>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Rule Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify({
                name,
                rules: steps.map(step => ({
                  level: step.level,
                  approverRole: step.approverRole,
                  autoApprove: step.autoApprove,
                  condition: step.condition
                }))
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}