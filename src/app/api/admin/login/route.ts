import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, createAdminToken, verifyAdminCredentials } from '../../../../lib/admin-auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (typeof email !== 'string' || typeof password !== 'string' || !(await verifyAdminCredentials(email, password))) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return response;
}
