import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('briefing_session')?.value;
  const isValid = token ? await verifySessionToken(token) : false;
  if (!isValid) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|preview-bg|api/auth|api/generate|_next/static|_next/image|favicon.ico).*)'],
};
