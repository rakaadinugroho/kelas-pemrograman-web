import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Bearer token tidak ditemukan.',
          hint: 'Login dulu di POST /api/auth-demo/jwt/login, lalu kirim header: Authorization: Bearer <token>',
        },
      },
      { status: 401 }
    )
  }

  const token = authHeader.slice('Bearer '.length)
  const result = verifyJwt(token)

  if (!result.valid) {
    return NextResponse.json(
      { error: { code: 'INVALID_TOKEN', message: result.reason } },
      { status: 401 }
    )
  }

  return NextResponse.json({
    data: {
      message: `Halo, ${result.payload.sub}! Token valid.`,
      method: 'JWT (HS256)',
      payload: result.payload,
      note: 'Verifikasi cuma cek signature & exp — tidak perlu round-trip ke database.',
    },
  })
}
