import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const timestamp = new Date().toISOString()
  const method = request.method
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown'

  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║  📋 Request Log                                           ║
  ╠══════════════════════════════════════════════════════════╣
  ║  Time:    ${timestamp.padEnd(47)}║
  ║  Method:  ${method.padEnd(47)}║
  ║  Path:    ${pathname.padEnd(47)}║
  ║  IP:      ${ip.padEnd(47)}║
  ╚══════════════════════════════════════════════════════════╝
  `)

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
