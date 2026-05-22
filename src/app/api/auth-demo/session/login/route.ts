import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { sessions } from '@/lib/session-store'

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

  const sessionId = randomBytes(32).toString('hex')
  sessions.set(sessionId, { username, createdAt: Date.now() })

  const response = NextResponse.json({
    data: {
      message: `Halo, ${username}! Session dibuat.`,
      method: 'Session Cookie',
      note: 'Session ID disimpan di server (Map). Klien hanya pegang cookie httpOnly.',
    },
  })

  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  })

  return response
}
