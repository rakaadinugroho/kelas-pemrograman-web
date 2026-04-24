import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/api/protected']
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
]

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 50

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now - record.timestamp > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }

  if (record.count >= MAX_REQUESTS) {
    return true
  }

  record.count++
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous'

  console.log(`[${new Date().toISOString()}] ${request.method} ${pathname} from ${ip}`)

  if (pathname.startsWith('/api')) {
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil(WINDOW_MS / 1000),
          },
        },
        { status: 429 }
      )
    }

    const authToken = request.cookies.get('token')?.value
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !authToken) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required. Please login.',
          },
        },
        { status: 401 }
      )
    }

    const origin = request.headers.get('origin')
    const response = NextResponse.next()

    response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS.includes(origin || '') ? origin! : ALLOWED_ORIGINS[0])
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    if (request.method === 'OPTIONS') {
      return response
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
