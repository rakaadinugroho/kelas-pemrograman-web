import { NextRequest, NextResponse } from 'next/server'
import { sessions } from '@/lib/session-store'

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value

  if (!sessionId) {
    return NextResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Tidak ada session cookie. Silakan login dulu.',
          hint: 'POST /api/auth-demo/session/login',
        },
      },
      { status: 401 }
    )
  }

  const session = sessions.get(sessionId)
  if (!session) {
    return NextResponse.json(
      {
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session tidak ditemukan atau sudah dihapus.',
        },
      },
      { status: 401 }
    )
  }

  return NextResponse.json({
    data: {
      message: `Halo, ${session.username}! Session masih aktif.`,
      method: 'Session Cookie',
      session: {
        username: session.username,
        createdAt: new Date(session.createdAt).toISOString(),
      },
    },
  })
}
