import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { username, password } = body

  if (!username || !password) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Username and password are required.',
        },
      },
      { status: 400 }
    )
  }

  if (username === 'admin' && password === 'admin123') {
    const response = NextResponse.json({
      data: {
        message: 'Login successful!',
        user: {
          username: 'admin',
          role: 'admin',
        },
      },
    })

    response.cookies.set('token', 'mock-jwt-token-12345', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  }

  return NextResponse.json(
    {
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password.',
        hint: 'Try: username=admin, password=admin123',
      },
    },
    { status: 401 }
  )
}

export async function DELETE() {
  const response = NextResponse.json({
    data: {
      message: 'Logout successful!',
    },
  })

  response.cookies.delete('token')

  return response
}
