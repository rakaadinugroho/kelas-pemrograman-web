import { NextRequest, NextResponse } from 'next/server'
import { signJwt } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  if (username !== 'admin' || password !== 'admin123') {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Username atau password salah.',
          hint: 'Try: { "username": "admin", "password": "admin123" }',
        },
      },
      { status: 401 }
    )
  }

  const token = signJwt({ sub: username, role: 'admin' }, 60 * 15)

  return NextResponse.json({
    data: {
      message: `Halo, ${username}! Berikut JWT-mu.`,
      method: 'JWT (HS256)',
      token,
      expiresInSeconds: 60 * 15,
      note: 'Server TIDAK menyimpan token. Klien kirim balik via header: Authorization: Bearer <token>',
    },
  })
}
