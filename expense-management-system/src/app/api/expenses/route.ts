import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement actual expense fetching logic
    // For now, return mock data
    const mockExpenses = [
      {
        id: '1',
        userId: '1',
        amount: 150.00,
        currency: 'USD',
        category: 'meals',
        description: 'Business lunch with client',
        date: '2024-01-15',
        receiptUrl: '/receipt1.jpg',
        status: 'approved',
        approvalLevel: 2,
        approvers: ['manager1', 'finance1'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
      },
    ];

    return NextResponse.json(mockExpenses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const expenseData = await request.json();

    // TODO: Implement actual expense creation logic
    // For now, return mock data
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      status: 'pending',
      approvalLevel: 1,
      approvers: ['manager1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}