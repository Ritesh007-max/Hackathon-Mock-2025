import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // TODO: Implement actual signup logic
    // For now, return mock data
    const mockUser = {
      id: '1',
      email,
      name,
      role: 'admin', // First user becomes admin
      companyId: '1',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    return NextResponse.json({ error: 'Signup failed' }, { status: 400 });
  }
}