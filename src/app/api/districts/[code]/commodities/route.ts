import { NextRequest, NextResponse } from 'next/server'
import { commodities } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const districtCommodities = commodities.filter(
    (c) => c.districtCode.toLowerCase() === code.toLowerCase()
  )

  let filtered = districtCommodities

  if (category) {
    filtered = filtered.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    )
  }

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      districtCode: code.toUpperCase(),
      filters: { category },
    },
  })
}