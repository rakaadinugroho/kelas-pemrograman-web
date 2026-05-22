import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.JWT_SECRET || 'demo-secret-jangan-pakai-di-produksi'

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64urlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(padded, 'base64')
}

export type JwtPayload = Record<string, unknown> & {
  iat?: number
  exp?: number
}

export function signJwt(payload: JwtPayload, expiresInSeconds = 3600): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body: JwtPayload = { ...payload, iat: now, exp: now + expiresInSeconds }

  const encodedHeader = base64url(JSON.stringify(header))
  const encodedBody = base64url(JSON.stringify(body))
  const data = `${encodedHeader}.${encodedBody}`
  const signature = base64url(createHmac('sha256', SECRET).update(data).digest())

  return `${data}.${signature}`
}

export type VerifyResult =
  | { valid: true; payload: JwtPayload }
  | { valid: false; reason: string }

export function verifyJwt(token: string): VerifyResult {
  const parts = token.split('.')
  if (parts.length !== 3) return { valid: false, reason: 'Format token tidak valid.' }

  const [encodedHeader, encodedBody, signature] = parts
  const data = `${encodedHeader}.${encodedBody}`
  const expected = base64url(createHmac('sha256', SECRET).update(data).digest())

  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, reason: 'Signature tidak cocok — token mungkin dimanipulasi.' }
  }

  const payload = JSON.parse(base64urlDecode(encodedBody).toString('utf-8')) as JwtPayload
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: 'Token sudah kadaluwarsa.' }
  }

  return { valid: true, payload }
}
