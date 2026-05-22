import { NextRequest, NextResponse } from 'next/server'

const USERS: Record<string, string> = {
  admin: 'admin123',
  budi: 'rahasia',
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Basic ')) {
    return NextResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing Basic Auth credentials.',
          hint: 'Send header: Authorization: Basic base64(username:password)',
        },
      },
      {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Demo"' },
      }
    )
  }

  const encoded = authHeader.slice('Basic '.length)
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const [username, password] = decoded.split(':')

  if (!username || USERS[username] !== password) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Username atau password salah.',
          hint: 'Try: admin:admin123  atau  budi:rahasia',
        },
      },
      { status: 401 }
    )
  }

  return NextResponse.json({
    data: {
      message: `Halo, ${username}! Basic Auth berhasil.`,
      method: 'Basic Auth',
      note: 'Kredensial dikirim ulang di SETIAP request. Hanya Base64 (bukan enkripsi) — WAJIB HTTPS.',
    },
  })
}
