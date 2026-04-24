# Middleware in Next.js

## A Comprehensive Guide for Software Engineering Students

---

## Table of Contents

1. [What is Middleware?](#1-what-is-middleware)
2. [Why Use Middleware?](#2-why-use-middleware)
3. [Middleware in Next.js](#3-middleware-in-nextjs)
4. [Request Flow Diagram](#4-request-flow-diagram)
5. [Common Use Cases](#5-common-use-cases)
6. [Hands-On Examples](#6-hands-on-examples)
7. [Middleware Best Practices](#7-middleware-best-practices)
8. [Summary](#8-summary)

---

## 1. What is Middleware?

### Definition

**Middleware** is a function that sits between the incoming request and the server's response. It can intercept, modify, or block requests before they reach your route handlers.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARE CONCEPT                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    Request                                                           Response
│       │                                                                 ▲
│       ▼                                                                 │
│   ┌───────────────┐                                                   │
│   │   Middleware   │   ←─── Can intercept, modify, or reject          │
│   │   Function     │                                                   │
│   └───────────────┘                                                   │
│       │                                                                 │
│       ▼                                                                 │
│   ┌───────────────┐                                                   │
│   │   Next        │   ←─── Pass to next handler                       │
│   │   Middleware  │                                                   │
│   └───────────────┘                                                   │
│       │                                                                 │
│       ▼                                                                 │
│   ┌───────────────┐                                                   │
│   │   Route       │   ←─── Final destination                          │
│   │   Handler     │                                                   │
│   └───────────────┘                                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Real-World Analogy: Hotel Lobby

```
┌─────────────────────────────────────────────────────────────────┐
│                     HOTEL LOBBY ANALOGY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Visitor ──▶  Receptionist  ──▶  Security  ──▶  Elevator       │
│                    (Log)           (Check ID)    (Final)        │
│                                                                  │
│   1. Receptionist logs visitor                                  │
│   2. Security checks if visitor is allowed                      │
│   3. If allowed → proceed to elevator                            │
│   4. If not allowed → turn away                                 │
│                                                                  │
│   Each step can:                                                  │
│   - Allow → pass to next step                                   │
│   - Modify → change something                                    │
│   - Block → stop the request                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Why Use Middleware?

### Benefits of Middleware

| Benefit | Description |
|---------|-------------|
| **Cross-cutting Concerns** | Handle logging, auth, CORS in one place |
| **Code Reusability** | Write once, use across all routes |
| **Cleaner Code** | Separate business logic from infrastructure |
| **Centralized Control** | Single point for request/response processing |
| **Performance** | Can cache responses, compress data |

### Problems Without Middleware

```
❌ WITHOUT MIDDLEWARE (Anti-pattern)
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   /api/users (List users)                                       │
│   ├── Check auth manually                                        │
│   ├── Log request manually                                       │
│   ├── Set CORS headers manually                                   │
│   └── Validate input manually                                    │
│                                                                  │
│   /api/products (List products)                                   │
│   ├── Check auth manually  ← DUPLICATE!                         │
│   ├── Log request manually   ← DUPLICATE!                       │
│   ├── Set CORS headers manually  ← DUPLICATE!                   │
│   └── Validate input manually  ← DUPLICATE!                   │
│                                                                  │
│   Problem: Same code repeated in every route!                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

✅ WITH MIDDLEWARE (Best Practice)
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   middleware.ts                                                  │
│   ├── Check auth for ALL routes                                  │
│   ├── Log ALL requests                                          │
│   └── Set CORS headers for ALL routes                           │
│                                                                  │
│   /api/users (Route Handler)                                     │
│   └── Just business logic                                        │
│                                                                  │
│   /api/products (Route Handler)                                  │
│   └── Just business logic                                        │
│                                                                  │
│   Benefit: Write once, use everywhere!                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Middleware in Next.js

### How Next.js Middleware Works

Next.js uses **Edge Runtime** middleware that runs at the edge (close to the user) before any caching happens.

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS REQUEST FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Request                                                        │
│      │                                                           │
│      ▼                                                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    middleware.ts                          │   │
│   │   • Runs on Edge Runtime                                  │   │
│   │   • Matches all routes by default                         │   │
│   │   • Can redirect, rewrite, or continue                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│      │                                                           │
│      ▼                                                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Route Matching (App Router)                   │   │
│   │   • Static files                                          │   │
│   │   • Dynamic routes /app/api/*                             │   │
│   │   • Pages /app/dashboard/*                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│      │                                                           │
│      ▼                                                           │
│   Response                                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### File Location

Middleware must be in your **src/** directory at the root level:

```
src/
├── app/
│   ├── api/
│   │   └── districts/
│   │       └── route.ts
│   ├── page.tsx
│   └── layout.tsx
├── lib/
│   └── mock-data.ts
└── middleware.ts       ← MUST be here (root of src/)
```

---

## 4. Request Flow Diagram

### Detailed Middleware Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      REQUEST FLOW IN DETAIL                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Browser                                                                │
│      │                                                                   │
│      │ HTTP Request                                                       │
│      ▼                                                                   │
│   ┌──────────────────────────────────────────────────────────┐           │
│   │                    MIDDLEWARE                             │           │
│   │                                                          │           │
│   │   1. Check if route needs processing                      │           │
│   │          │                                                │           │
│   │          ▼                                                │           │
│   │   2. Auth validation (token, session)                     │           │
│   │          │                                                │           │
│   │          ├─── Valid? ────▶ Continue                       │           │
│   │          │                                                │           │
│   │          └─── Invalid? ──▶ Return 401/403                 │           │
│   │                        │                                   │           │
│   │                        ▼                                   │           │
│   │   3. Logging / Analytics                                   │           │
│   │          │                                                │           │
│   │   4. CORS Headers                                         │           │
│   │          │                                                │           │
│   │   5. Rate Limiting check                                  │           │
│   │          │                                                │           │
│   │          ├─── Allowed? ───▶ Continue                      │           │
│   │          │                                                │           │
│   │          └─── Rate Limited? ──▶ Return 429               │           │
│   │                                                          │           │
│   └──────────────────────────────────────────────────────────┘           │
│      │                                                                   │
│      ▼                                                                   │
│   Route Handler (API Route or Page)                                       │
│      │                                                                   │
│      ▼                                                                   │
│   Response                                                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Matching Paths

Middleware matches paths using the `matcher` configuration:

```typescript
export const config = {
  matcher: [
    '/api/:path*',           // All API routes
    '/dashboard/:path*',     // Dashboard routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',  // Exclude static files
  ]
}
```

---

## 5. Common Use Cases

### Use Case 1: Authentication

```typescript
// Check if user is logged in
// Block unauthorized access to protected routes

if (pathname.startsWith('/dashboard')) {
  const token = request.cookies.get('auth-token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

### Use Case 2: Logging & Analytics

```typescript
// Log all incoming requests
// Track user behavior, API usage

console.log({
  method: request.method,
  pathname: pathname,
  timestamp: new Date().toISOString(),
  ip: request.headers.get('x-forwarded-for'),
})
```

### Use Case 3: CORS (Cross-Origin Resource Sharing)

```typescript
// Allow cross-origin requests from specific domains

const response = NextResponse.next()
response.headers.set('Access-Control-Allow-Origin', 'https://myapp.com')
response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

return response
```

### Use Case 4: Rate Limiting

```typescript
// Prevent abuse by limiting requests per IP

const ip = request.headers.get('x-forwarded-for') || 'anonymous'
const requestCount = rateLimitStore.get(ip) || 0

if (requestCount > 100) {
  return new NextResponse('Too Many Requests', { status: 429 })
}

rateLimitStore.set(ip, requestCount + 1)
```

### Use Case 5: A/B Testing

```typescript
// Redirect users to different versions

const variant = Math.random() > 0.5 ? 'A' : 'B'
const response = NextResponse.next()
response.cookies.set('ab-variant', variant)
return response
```

### Use Case 6: Geolocation / Localization

```typescript
// Detect user location and redirect to appropriate version

const country = request.headers.get('x-vercel-ip-country') || 'ID'
const response = NextResponse.next()
response.headers.set('x-user-country', country)
return response
```

---

## 6. Hands-On Examples

### Example 1: Basic Logging Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`
╔══════════════════════════════════════════════════════════╗
║  📋 Request Log                                            ║
╠══════════════════════════════════════════════════════════╣
║  Method: ${request.method.padEnd(47)}║
║  Path:   ${pathname.padEnd(47)}║
║  Time:   ${new Date().toISOString().padEnd(47)}║
╚══════════════════════════════════════════════════════════╝
  `)

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}
```

### Example 2: Authentication Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/api/protected', '/profile']
const PUBLIC_ROUTES = ['/login', '/register', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookie or header
  const authToken = request.cookies.get('token')?.value ||
                    request.headers.get('Authorization')?.replace('Bearer ', '')

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  // Block protected routes without auth
  if (isProtectedRoute && !authToken) {
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

  // Redirect logged-in users away from public auth routes
  if (isPublicRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Example 3: CORS Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://wonosobo-smartcity.vercel.app',
  'https://my-frontend-app.com',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply CORS to API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const origin = request.headers.get('origin')
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)

  const response = new NextResponse.next()

  response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : ALLOWED_ORIGINS[0])
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response
  }

  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
```

### Example 4: Rate Limiting Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory store (use Redis in production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }

  // Reset if window has passed
  if (now - record.timestamp > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return false
  }

  // Increment count
  if (record.count >= MAX_REQUESTS) {
    return true
  }

  record.count++
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only rate limit API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'anonymous'

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

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS))
  response.headers.set('X-RateLimit-Remaining', String(MAX_REQUESTS - (rateLimitMap.get(ip)?.count || 0)))

  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
```

### Example 5: API Key Authentication

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const VALID_API_KEYS = ['key-dev-12345', 'key-prod-67890']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only check API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Skip for public API endpoints
  if (pathname === '/api/public') {
    return NextResponse.next()
  }

  const apiKey = request.headers.get('x-api-key')

  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid or missing API key.',
        },
      },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
```

### Example 6: Combined Middleware (All Features)

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuration
const PROTECTED_ROUTES = ['/dashboard', '/api/protected']
const PUBLIC_ROUTES = ['/login', '/register']
const ALLOWED_ORIGINS = ['http://localhost:3000']

// Rate limiting
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

  if (record.count >= MAX_REQUESTS) return true
  record.count++
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous'

  console.log(`[${new Date().toISOString()}] ${request.method} ${pathname} from ${ip}`)

  // Rate limiting for API
  if (pathname.startsWith('/api')) {
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please try again later.',
          },
        },
        { status: 429 }
      )
    }
  }

  // Authentication check
  const authToken = request.cookies.get('token')?.value
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !authToken) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // CORS for API routes
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    const response = NextResponse.next()

    response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0])
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (request.method === 'OPTIONS') {
      return response
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 7. Middleware Best Practices

### DO's ✅

```
┌────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE BEST PRACTICES                    │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Keep middleware lightweight and fast                         │
│  ✅ Use early returns for excluded paths                         │
│  ✅ Combine related middleware into one file                    │
│  ✅ Use matcher config to limit scope                           │
│  ✅ Handle errors gracefully with proper status codes           │
│  ✅ Log important events for debugging                          │
│  ✅ Use environment variables for configuration                │
│  ✅ Clean up resources in finally blocks                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### DON'Ts ❌

```
┌────────────────────────────────────────────────────────────────┐
│                   MIDDLEWARE ANTI-PATTERNS                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ Don't do heavy computations in middleware                    │
│  ❌ Don't make database calls (use edge-compatible DBs instead) │
│  ❌ Don't store sensitive data in middleware                    │
│  ❌ Don't block with synchronous operations                     │
│  ❌ Don't forget to handle OPTIONS for CORS                     │
│  ❌ Don't apply middleware to static files                      │
│  ❌ Don't log sensitive user data (passwords, tokens)          │
│  ❌ Don't nest middleware unnecessarily                         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Performance Tips

```typescript
// ❌ BAD: Expensive operation in middleware
export function middleware(request: NextRequest) {
  const user = await database.query('SELECT * FROM users') // SLOW!
  return NextResponse.next()
}

// ✅ GOOD: Quick checks, defer expensive ops
export function middleware(request: NextRequest) {
  // Quick validations only
  const token = request.cookies.get('token')
  if (!token) return unauthorized()

  // Let the route handler do heavy lifting
  return NextResponse.next()
}
```

---

## 8. Summary

### Key Takeaways

| Concept | Description |
|---------|-------------|
| **Middleware** | Functions that intercept requests/responses |
| **Next.js Middleware** | Uses Edge Runtime, runs before cache |
| **Use Cases** | Auth, logging, CORS, rate limiting, A/B testing |
| **Matcher** | Configuration to specify which routes to process |
| **NextResponse** | Utility class for creating responses |

### Middleware vs API Routes

```
┌────────────────────────────────────────────────────────────────┐
│              MIDDLEWARE vs API ROUTES                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   MIDDLEWARE                      API ROUTES                   │
│   ──────────                      ──────────                   │
│   Runs before routing             Runs after routing            │
│   Edge Runtime                    Node.js Runtime               │
│   Lightweight, fast               Full Node.js capabilities     │
│   Can't access DB directly        Can access databases          │
│   Perfect for: Auth, CORS,        Perfect for: CRUD ops,        │
│   logging, rate limiting          complex business logic         │
│                                                                 │
│   Use middleware for:              Use API routes for:          │
│   • Validation (quick)             • Database operations         │
│   • Authentication                 • File operations            │
│   • Authorization                   • Complex calculations        │
│   • CORS                           • Third-party APIs           │
│   • Rate limiting                  • Heavy processing           │
│   • Logging                                                │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### When to Use What?

```
Request arrives
      │
      ▼
┌─────────────────┐
│   Middleware     │  ←── Quick checks: Auth, CORS, Rate Limit, Logging
│   (Edge Runtime)│
└────────┬────────┘
         │
         │ Pass?
         ▼
┌─────────────────┐
│   Route Handler │  ←── Business logic, DB access, heavy processing
│   (API Routes)  │
└─────────────────┘
```

---

## Exercises for Students

### Exercise 1: Basic Logger
Create a middleware that logs all requests to `/api/*` routes.

### Exercise 2: Feature Flags
Create a middleware that checks a `feature-flag` cookie and redirects based on the value.

### Exercise 3: Request Timer
Create a middleware that adds an `X-Response-Time` header to each response.

### Exercise 4: Country-Based Redirect
Create a middleware that redirects users from certain countries to a localized version.

---

*Document Version: 1.0*
*Last Updated: April 2026*
*Author: Wonosobo Smart City Development Team*
