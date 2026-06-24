import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
  )

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload
  } catch {
    return null
  }
}

export async function getSession() {
  const token = cookies().get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function checkPassword(input) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  return input === adminPassword
}
