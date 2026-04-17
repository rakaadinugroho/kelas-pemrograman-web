import { NextRequest, NextResponse } from 'next/server'
import { districts } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const district = districts.find(
    (d) => d.code.toLowerCase() === code.toLowerCase()
  )

  if (!district) {
    return NextResponse.json(
      {
        error: {
          code: 'NOT_FOUND',
          message: `District with code '${code}' not found`,
        },
      },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: district })
}