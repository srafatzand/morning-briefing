import { NextRequest, NextResponse } from 'next/server';
import { isPinValid, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  if (!isPinValid(pin)) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  }
  const token = await createSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set('briefing_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  });
  return res;
}
