import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // TODO: Implement actual authentication logic
    // For now, return mock data
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'employee',
      companyId: '1',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 401 });
  }
}