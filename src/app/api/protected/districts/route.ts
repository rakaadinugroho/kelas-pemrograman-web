import { NextRequest, NextResponse } from 'next/server'
import { districts } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('token')?.value

  if (!authToken) {
    return NextResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide a valid token.',
          hint: 'Add header: Authorization: Bearer <token>',
        },
      },
      { status: 401 }
    )
  }

  return NextResponse.json({
    data: {
      message: 'Welcome to the protected districts data!',
      totalDistricts: districts.length,
      districts: districts,
    },
    meta: {
      accessedBy: 'authenticated-user',
      timestamp: new Date().toISOString(),
    },
  })
}
