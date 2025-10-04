'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency } from '@/lib/utils';
import { Upload, Camera, Receipt, Loader2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';

const EXPENSE_CATEGORIES = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Transportation',
  'Accommodation',
  'Entertainment',
  'Training',
  'Other'
];

export default function SubmitExpensePage() {
  const { user, company } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    amount: '',
    currency: company?.currency || 'USD',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receiptFile: null as File | null,
  });
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState<any>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: api.getCountries,
  });

  const { data: exchangeRates } = useQuery({
    queryKey: ['exchangeRates', formData.currency],
    queryFn: () => api.getExchangeRate(formData.currency),
    enabled: !!formData.currency && formData.currency !== company?.currency,
  });

  const createExpenseMutation = useMutation({
    mutationFn: api.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      router.push('/dashboard');
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Convert amount if currency is different from company currency
    if (field === 'amount' || field === 'currency') {
      convertAmount();
    }
  };

  const convertAmount = () => {
    if (!formData.amount || !exchangeRates || !company?.currency) {
      setConvertedAmount(null);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      setConvertedAmount(null);
      return;
    }

    if (formData.currency === company.currency) {
      setConvertedAmount(amount);
    } else {
      const rate = exchangeRates.rates[company.currency];
      if (rate) {
        setConvertedAmount(amount * rate);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    setFormData(prev => ({ ...prev, receiptFile: file }));
    setOcrLoading(true);
    setOcrResults(null);

    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Parse OCR results (basic implementation)
      const lines = text.split('\n');
      const amountMatch = text.match(/\$?(\d+\.?\d*)/g);
      const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g);

      const results = {
        text,
        extractedAmount: amountMatch ? amountMatch[amountMatch.length - 1].replace('$', '') : null,
        extractedDate: dateMatch ? dateMatch[0] : null,
        vendor: lines[0] || 'Unknown Vendor',
      };

      setOcrResults(results);

      // Auto-fill form with OCR results
      if (results.extractedAmount) {
        setFormData(prev => ({ ...prev, amount: results.extractedAmount }));
      }
      if (results.extractedDate) {
        // Convert date format if needed
        const date = new Date(results.extractedDate);
        if (!isNaN(date.getTime())) {
          setFormData(prev => ({ 
            ...prev, 
            date: date.toISOString().split('T')[0] 
          }));
        }
      }
      if (results.vendor && !formData.description) {
        setFormData(prev => ({ 
          ...prev, 
          description: `Receipt from ${results.vendor}` 
        }));
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setOcrResults({ error: 'Failed to process receipt' });
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !company) return;

    const expenseData = {
      userId: user.id,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      convertedAmount: convertedAmount || parseFloat(formData.amount),
      companyCurrency: company.currency,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      status: 'pending' as const,
      approvalLevel: 1,
      approvers: [],
      approvals: [],
    };

    createExpenseMutation.mutate(expenseData);
  };

  const currencies = countries
    .flatMap(country => Object.keys(country.currencies || {}))
    .filter((currency, index, array) => array.indexOf(currency) === index)
    .sort();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Submit Expense</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {convertedAmount && formData.currency !== company?.currency && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Converted to company currency: {formatCurrency(convertedAmount, company?.currency || 'USD')}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this expense..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={createExpenseMutation.isPending}
              >
                {createExpenseMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Expense'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Receipt Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Receipt Upload</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium">Upload Receipt</p>
                  <p className="text-sm text-gray-500">
                    Take a photo or upload an image of your receipt
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={ocrLoading}
                >
                  {ocrLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
              </div>
            </div>

            {formData.receiptFile && (
              <div className="space-y-2">
                <Label>Selected File</Label>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <Receipt className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formData.receiptFile.name}</span>
                  <Badge variant="secondary">{(formData.receiptFile.size / 1024).toFixed(1)} KB</Badge>
                </div>
              </div>
            )}

            {ocrResults && (
              <div className="space-y-2">
                <Label>OCR Results</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {ocrResults.error ? (
                    <p className="text-red-600 text-sm">{ocrResults.error}</p>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {ocrResults.extractedAmount && (
                        <div className="flex justify-between">
                          <span className="font-medium">Amount:</span>
                          <span>{ocrResults.extractedAmount}</span>
                        </div>
                      )}
                      {ocrResults.extractedDate && (
                        <div className="flex justify-between">
                          <span className="font-medium">Date:</span>
                          <span>{ocrResults.extractedDate}</span>
                        </div>
                      )}
                      {ocrResults.vendor && (
                        <div className="flex justify-between">
                          <span className="font-medium">Vendor:</span>
                          <span>{ocrResults.vendor}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}