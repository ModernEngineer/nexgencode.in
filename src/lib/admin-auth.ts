import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE = 'nexgencode_admin';

function getSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error('Missing ADMIN_SESSION_SECRET environment variable');
  return new TextEncoder().encode(value);
}

export async function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH_B64
    ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64, 'base64').toString('utf8')
    : process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !passwordHash) throw new Error('Admin credentials are not configured');
  return email.toLowerCase() === adminEmail.toLowerCase() && bcrypt.compare(password, passwordHash);
}

export async function createAdminToken() {
  return new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(getSecret());
}

export async function isAdminTokenValid(token?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
