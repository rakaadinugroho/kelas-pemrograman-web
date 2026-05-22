import { NextRequest, NextResponse } from 'next/server'
import { sessions } from '@/lib/session-store'

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value
  if (sessionId) sessions.delete(sessionId)

  const response = NextResponse.json({
    data: { message: 'Logout berhasil. Session dihapus di server dan cookie dihapus di browser.' },
  })
  response.cookies.delete('session_id')
  return response
}
