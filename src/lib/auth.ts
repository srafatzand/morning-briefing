import { SignJWT, jwtVerify } from 'jose';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET environment variable is not set');
const secret = new TextEncoder().encode(jwtSecret);

export async function createSessionToken() {
  return new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

const pinCode = process.env.PIN_CODE;
if (!pinCode) throw new Error('PIN_CODE environment variable is not set');

export function isPinValid(pin: string) {
  return pin === pinCode;
}
