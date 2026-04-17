import { NextRequest, NextResponse } from 'next/server'
import { inflationMarkets } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  const districtMarkets = inflationMarkets.filter(
    (m) => m.districtCode.toLowerCase() === code.toLowerCase()
  )

  let filtered = districtMarkets

  if (year) {
    filtered = filtered.filter((m) => m.year === parseInt(year))
  }

  if (month) {
    filtered = filtered.filter(
      (m) => m.month.toLowerCase() === month.toLowerCase()
    )
  }

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      districtCode: code.toUpperCase(),
      filters: { year, month },
    },
  })
}